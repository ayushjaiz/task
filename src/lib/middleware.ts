import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const getAuthUser = (request: NextRequest) => {
    try {
        const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return null;
        }

        const decoded = verifyToken(token);
        return decoded.userId;
    } catch {
        return null;
    }
};

export const requireAuth = (request: NextRequest) => {
    const userId = getAuthUser(request);
    if (!userId) {
        throw new Error('Authentication required');
    }
    return userId;
};
