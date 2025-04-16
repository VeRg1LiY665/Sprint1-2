import {NextFunction, Request, Response} from "express";
import {Error} from "mongoose";

type ExtensionType = {
    message: string;
    field: string;
};
const ForbiddenExt: ExtensionType[] = [{message: 'Data to be modified not yours', field: 'null'}];
const NotFoundExt: ExtensionType[] = [{message: 'Data not found in db', field: 'null'}];
const DuplicateLoginExt: ExtensionType[] = [{message: 'User with login already exists', field: 'login'}];
const DuplicateEmailExt: ExtensionType[] = [{message: 'User with email already exists', field: 'email'}];

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

    if (err.status !== undefined) {
        const resultErrMessage = {errorsMessages: err.extensions}; //здесь привел вывод ошибки к тому что ожидается тестами
        //console.log(err.message)
        res.status(err.status).send(resultErrMessage) //пока возвращаю по одной, в перспективе можно копить массив через next, потом возвращать прям массивом ошибки
    } else {
        console.error(err) //если брошена обычная ошибка (например монго отъехала), то она здесь залогируется и обработается
        res.status(500).send(err.message)
    }
}