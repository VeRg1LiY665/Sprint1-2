import {Request} from "express";

export const DeviceData = (req: Request) => {
    let loginOrEmail:string = req.body.loginOrEmail;
    let password:string = req.body.password;
    let ip:string = req.ip ? req.ip : '0.0.0.0';  //костыль - нужно придумать, что делать, если ip не прочитали
    let title:string = req.headers['user-agent'] ? req.headers['user-agent'] : 'Unknown device';

    return {loginOrEmail, password, ip, title};
}