import mongoose, { Document, Schema } from 'mongoose';

export interface SubtaskType {
    subtask_id: string;
    description: string;
    isCompleted: boolean;
}

export interface ITask extends Document {
    title: string;
    description: string;
    status: 'pending' | 'done';
    userId: mongoose.Types.ObjectId;
    subtasks: SubtaskType[];
    createdAt: Date;
    updatedAt: Date;
}

const SubtaskSchema = new Schema({
    subtask_id: {
        type: String,
        required: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: [200, 'Subtask description cannot be more than 200 characters']
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
});

const TaskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    status: {
        type: String,
        enum: ['pending', 'done'],
        default: 'pending',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subtasks: [SubtaskSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

TaskSchema.pre('save', function (this: ITask, next: () => void) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
