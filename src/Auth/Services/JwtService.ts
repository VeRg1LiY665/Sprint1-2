import jwt from 'jsonwebtoken';
import {SETTINGS} from "../../settings";

export const jwtService = {
    async createToken(userId: string): Promise<string> {
        return jwt.sign({userId},
            SETTINGS.AC_SECRET,
        {expiresIn: +SETTINGS.AC_TIME}
        );
    },

    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error('Cannot decode token', e);
            return null;
        }
    },

    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, SETTINGS.AC_SECRET) as { userId: string };
        } catch (error) {
            console.error('Cannot verify token');
            return null;
        }
    },
};