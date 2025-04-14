import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {UserDBType} from "../Data Types/UserDBType";

export const usersSchema = new mongoose.Schema<UserDBType>({
    _id: ObjectId,
    login: String,
    email: String,
    passwordHash: String,
    createdAt: String,
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean,
    },
    passwordRecovery: {
        recoveryCode: String,
        expirationDate: Date,
    },
})