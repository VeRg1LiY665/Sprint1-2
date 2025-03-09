import {Request, Response} from 'express';
import {AuthServices} from "./AuthService";

export const authController ={
login : async (req: Request, res: Response) => {
const authFlag = await AuthServices.LoginUser(req.body);
    (authFlag) ? res.status(204).json() : res.status(401).json('Login or password are not correct');
},

info: async(req: Request, res: Response) => {

}
}


