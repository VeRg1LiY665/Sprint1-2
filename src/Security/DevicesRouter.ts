import {Router} from "express";
import {DevicesController} from "./DevicesController";
import {ObjectIdValidationMiddleware} from "../Modules/Blogs/BlogsMiddlewares";
import {container} from "../composition-root";

export const devicesRouter = Router();
const devicesController = container.get(DevicesController);

devicesRouter.get('/',
    devicesController.getDevices.bind(devicesController));

devicesRouter.delete('/',
    devicesController.deleteAllDevices.bind(devicesController));

devicesRouter.delete('/:id',
    ObjectIdValidationMiddleware,
    devicesController.deleteDevice.bind(devicesController));