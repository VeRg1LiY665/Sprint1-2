import {body, ValidationChain} from "express-validator";


export const UserLoginOrEmailValidation:ValidationChain =body ('loginOrEmail').trim()
    .isString().withMessage('Login or Email is not string')

export const passwordRecoveryValidation:ValidationChain =body ('newPassword').trim()
    .isString().withMessage('Password is not string')
    .isLength({min:6, max:20}).withMessage('Password length should be within 1 to 15 characters')


