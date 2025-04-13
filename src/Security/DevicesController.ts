import {Request, Response, NextFunction} from 'express';
import {HttpStatuses} from "../helpers/ErrorHandler";
import {DevicesQRepo} from "./Repositories/DevicesQRepo";
import {DevicesServices} from "./Services/DevicesService";
import {JwtService} from "../Auth/Services/JwtService";
import {injectable} from "inversify";

@injectable()
export class DevicesController {
    constructor (protected jwtService: JwtService,
                 protected devicesQRepo: DevicesQRepo,
                 protected devicesServices: DevicesServices,) {}

     async getDevices(req: Request, res: Response, next:NextFunction)  {
    try {
    const userId = await this.jwtService.verifyRToken(req.cookies.refreshToken)

    const result = await this.devicesQRepo.showAllDevices(userId.userId)

    res.status(HttpStatuses.Success).json(result)
}
catch (err) {next(err)}
}

 async deleteAllDevices(req: Request, res: Response, next:NextFunction)  {
    //Удаляем все кроме текущего!
    try {
        //TODO перенести проверку токена в сервис
        const payload = await this.jwtService.verifyRToken(req.cookies.refreshToken)
        await this.devicesServices.deleteAllDevices(payload.userId, payload.iat)
        res.sendStatus(HttpStatuses.NoContent)
    }
    catch (err) {next(err)}
}

     async deleteDevice(req: Request, res: Response, next:NextFunction)  {
    try {
        await this.devicesServices.deleteDevice(req.params.id, req.cookies.refreshToken)
        res.sendStatus(204)
    }
    catch (err) {next(err)}
}
}

/*
export const devicesController= {
    getDevices: async (req: Request, res: Response, next:NextFunction) => {
try {
    const userId = await jwtService.verifyRToken(req.cookies.refreshToken)

    const result = await DevicesQRepo.showAllDevices(userId.userId)

    res.status(HttpStatuses.Success).json(result)
}
        catch (err) {next(err)}
    },

    deleteAllDevices: async (req: Request, res: Response, next:NextFunction) => {
        //Удаляем все кроме текущего!
try {
    //TODO перенести проверку токена в сервис
    const payload = await jwtService.verifyRToken(req.cookies.refreshToken)
    await devicesServices.deleteAllDevices(payload.userId, payload.iat)
    res.sendStatus(HttpStatuses.NoContent)
}
catch (err) {next(err)}
},

    deleteDevice: async (req: Request, res: Response, next:NextFunction) => {
try {
    await devicesServices.deleteDevice(req.params.id, req.cookies.refreshToken)
    res.sendStatus(204)
}
catch (err) {next(err)}
}

}*/
