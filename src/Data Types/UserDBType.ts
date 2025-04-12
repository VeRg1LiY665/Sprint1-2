import {ObjectId} from "mongodb";

export class UserDBType {
  constructor(
   public _id: ObjectId,
   public login: string,
   public email: string,
   public passwordHash: string,
   public createdAt: string,
   public emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    },
   public passwordRecovery: {
        recoveryCode: string
        expirationDate: Date
    }
) {}
}

/*
export type UserDBType = {
    _id: ObjectId;
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    };
    passwordRecovery: {
        recoveryCode: string;
        expirationDate: Date;
    };
}*/
