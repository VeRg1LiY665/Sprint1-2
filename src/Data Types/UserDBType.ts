import {ObjectId} from "mongodb";

export type UserDBType = {
    _id: ObjectId;
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
}