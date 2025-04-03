import {Request, Response, NextFunction} from 'express';
import {HttpStatuses} from "../helpers/ErrorHandler";
import {DevicesQRepo} from "./Repositories/DevicesQRepo";
import {devicesServices} from "./Services/DevicesService";
import {jwtService} from "../Auth/Services/JwtService";

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

}