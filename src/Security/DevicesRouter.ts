import {Router} from "express";
import {devicesController} from "./DevicesController";
import {accessTokenGuard} from "../Auth/guards/AccesTokenGuard";

export const devicesRouter = Router();

devicesRouter.get('/',
    devicesController.getDevices);

devicesRouter.delete('/',
    devicesController.deleteAllDevices);

devicesRouter.delete('/:id',
    devicesController.deleteDevice);