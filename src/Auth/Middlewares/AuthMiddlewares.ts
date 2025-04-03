import {body, ValidationChain} from "express-validator";


export const UserLoginOrEmailValidation:ValidationChain =body ('loginOrEmail').trim()
    .isString().withMessage('Login or Email is not string')

