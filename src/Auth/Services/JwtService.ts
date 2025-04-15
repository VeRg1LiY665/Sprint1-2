import jwt from 'jsonwebtoken';
import {SETTINGS} from "../../settings";
import {CustomError, HttpStatuses, InvalidCredentialsError} from "../../helpers/ErrorHandler";
import {ObjectId} from "mongodb";
import {RefreshTokenPayloadType} from "../Types/RefreshTokenPayloadType";
import {injectable} from "inversify";

@injectable()
export class JwtService {

    async createToken(userId:ObjectId, deviceId: ObjectId): Promise<string> {
        return jwt.sign({userId, deviceId},
            SETTINGS.AC_SECRET,
            {expiresIn: +SETTINGS.AC_TIME}
        );
    }

    async createRToken(userId:ObjectId, deviceId: ObjectId): Promise<string> {
        return jwt.sign({userId, deviceId, iat : Math.floor(Date.now())}, //implemented iat in ms
            SETTINGS.R_SECRET,
            {expiresIn: +SETTINGS.R_TIME}
        );
    }

    async verifyToken(token: string): Promise<{ deviceId: ObjectId }> {
        try {
            return jwt.verify(token, SETTINGS.AC_SECRET) as
                {deviceId: ObjectId};
        } catch (error) {
            console.error('Cannot verify access token');
            throw new InvalidCredentialsError('Invalid credentials',
                [{ message:'Access token is invalid', field:'token'}])
        }
    }

    async verifyRToken(token: string): Promise<RefreshTokenPayloadType> {
        try {
            return jwt.verify(token, SETTINGS.R_SECRET) as RefreshTokenPayloadType;
        } catch (error) {
            console.error('Cannot verify refresh token');
            throw new InvalidCredentialsError('Invalid credentials',
                [{ message:'Refresh token is invalid', field:'token'}])
        }
    }

    async decodeRToken(token: string): Promise<RefreshTokenPayloadType> {
        try { //По идее можно обойтись только verify, но тут вопрос производительности - decode побыстрее должен быть
            return jwt.decode(token) as RefreshTokenPayloadType;
        } catch (e) {
            console.error("Can't decode token", e);
            throw new CustomError('Unexpected error',
                HttpStatuses.ServerError,
                [{message: 'Cannot decode refresh token', field: 'token'}]);
        }
    }
}

