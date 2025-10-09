import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import mongoose from 'mongoose';
import { SubtaskType } from '@/models/Task';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
    private model;

    constructor() {

        this.model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: {
                    description: 'An array of tasks as strings',
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.STRING,
                    },
                }
            }
        });
    }

    async generateSubtasks(title: string, description: string): Promise<SubtaskType[]> {
        try {
            const prompt = `
                Based on the following description, generate actionable tasks.
                Each task should be a clear, concise action item.
                
                Title: ${title}
                Description: ${description}

                Generate tasks as an array of strings. Keep each task under 100 characters.
                Focus on concrete, measurable actions that contribute to completing the main task.
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Parse response as direct array of strings
            const subtaskDescriptions: string[] = JSON.parse(text);
            
            // Transform string array to SubtaskType array
            const subtasks: SubtaskType[] = subtaskDescriptions.map(description => ({
                subtask_id: new mongoose.Types.ObjectId().toString(),
                description: description.trim(),
                isCompleted: false
            }));

            return subtasks;
        } catch (error) {
            console.error('Error generating subtasks with Gemini:', error);
            
            // Fallback: return empty array or basic subtasks
            return this.getFallbackSubtasks();
        }
    }

    private getFallbackSubtasks(): SubtaskType[] {
        // Basic fallback subtasks when AI fails
        const fallbackDescriptions = [
            'Plan and outline the approach',
            'Gather necessary resources',
            'Begin implementation',
            'Review and test the work',
            'Finalize and document'
        ];

        return fallbackDescriptions.map(desc => ({
            subtask_id: new mongoose.Types.ObjectId().toString(),
            description: desc,
            isCompleted: false
        }));
    }
}

// Export singleton instance
export const geminiService = new GeminiService();