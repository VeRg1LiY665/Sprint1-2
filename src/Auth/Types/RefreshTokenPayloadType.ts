import {ObjectId} from "mongodb";

export type RefreshTokenPayloadType = {
    userId: ObjectId,
    deviceId: ObjectId,
    iat: number,
    exp: number
}