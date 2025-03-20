import {NextFunction, Request, Response} from "express";
import {Error} from "mongoose";

type ExtensionType = {
    field: string;
    message: string;
};
const ForbiddenExt: ExtensionType[] = [{field: 'null', message: 'Data to be modified not yours'}];
const NotFoundExt: ExtensionType[] = [{field: 'null', message: 'Data not found in db'}];
const DuplicateLoginExt: ExtensionType[] = [{field: 'login', message: 'User with login already exists'}];
const DuplicateEmailExt: ExtensionType[] = [{field: 'email', message: 'User with email already exists'}];

export enum HttpStatuses {
    Success = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    ServerError = 500,
}

enum FieldNames {
    loginOrEmail = 'loginOrEmail',
    password = 'password'
}

export class CustomError extends Error{
    status: HttpStatuses
    extensions: ExtensionType[]

    constructor(message:string, status:HttpStatuses, extensions:ExtensionType[]){
        super(message)
        this.extensions = extensions
        this.status = status
    }
}

export class InvalidCredentialsError extends Error{
    status: HttpStatuses
    extensions: ExtensionType[]
    constructor(message:string, extensions:ExtensionType[]) {
        super(message)
        this.status = HttpStatuses.Unauthorized
        this.extensions=extensions
    }
}

export class ForbiddenError extends Error{
    status: HttpStatuses
    extensions: ExtensionType[]
    constructor(message:string) {
        super(message)
        this.status = HttpStatuses.Forbidden
        this.extensions = ForbiddenExt
    }
}

export class NotFoundError extends Error{
    status: HttpStatuses
    extensions: ExtensionType[]
    constructor(message:string) {
        super(message)
        this.status = HttpStatuses.NotFound
        this.extensions = NotFoundExt
    }
}

export class DuplicatedLoginError extends Error{
    status: HttpStatuses
    extensions: ExtensionType[]
    constructor(message:string) {
        super(message)
        this.status = HttpStatuses.BadRequest
        this.extensions = DuplicateLoginExt
    }
}

export class DuplicatedEmailError extends Error{
    status: HttpStatuses
    extensions: ExtensionType[]
    constructor(message:string) {
        super(message)
        this.status = HttpStatuses.BadRequest
        this.extensions = DuplicateEmailExt
    }
}

export const ErrorHandler = async(err:any, req:Request, res: Response, next:NextFunction) => {
    const resultErrMessage = {errorsMessages: err.extensions}; //здесь привел вывод ошибки к тому что ожидается тестами
    console.log(resultErrMessage)
    res.status(err.status).send(resultErrMessage) //пока возвращаю по одной, в перспективе можно копить массив через next, потом возвращать прям массивом ошибки
}