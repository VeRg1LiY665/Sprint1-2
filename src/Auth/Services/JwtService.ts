import jwt from 'jsonwebtoken';
import {SETTINGS} from "../../settings";
import {randomUUID} from "node:crypto";

export const jwtService = {
    async createToken(userId: string): Promise<string> {
        return jwt.sign({userId},
            SETTINGS.AC_SECRET,
        {expiresIn: +SETTINGS.AC_TIME}
        );
    },

    async createRToken(userId: string): Promise<string> {
        return jwt.sign({userId, add: randomUUID()},
            SETTINGS.R_SECRET,
            {expiresIn: +SETTINGS.R_TIME}
        );
    },

    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, SETTINGS.AC_SECRET) as {userId: string};
        } catch (error) {
            console.error('Cannot verify access token');
            return null;
        }
    },

    async verifyRToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, SETTINGS.R_SECRET) as {userId: string};
        } catch (error) {
            console.error('Cannot verify refresh token');
            return null;
        }
    },
};