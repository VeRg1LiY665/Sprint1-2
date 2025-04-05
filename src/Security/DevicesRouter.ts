import {Router} from "express";
import {devicesController} from "./DevicesController";
import {ObjectIdValidationMiddleware} from "../Modules/Blogs/BlogsMiddlewares";

export const devicesRouter = Router();

devicesRouter.get('/',
    devicesController.getDevices);

devicesRouter.delete('/',
    devicesController.deleteAllDevices);

devicesRouter.delete('/:id',
    ObjectIdValidationMiddleware,
    devicesController.deleteDevice);