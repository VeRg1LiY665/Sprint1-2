import {UsersRepo} from "../../Repositories/UsersRepo";
import {CustomError, ForbiddenError, HttpStatuses, NotFoundError} from "../../helpers/ErrorHandler";
import {jwtService} from "../../Auth/Services/JwtService";
import {DevicesRepo} from "../Repositories/DevicesRepo";
import {ObjectId} from "mongodb";
import {DevicesQRepo} from "../Repositories/DevicesQRepo";
import {devicesCollection} from "../../db/mongoDB";

export const devicesServices = {
    async deleteDevice(deviceId: string, RToken: string): Promise<void> {
        const payload = await jwtService.verifyRToken(RToken)

        const _id = new ObjectId(deviceId)
        const foundDevice = await DevicesRepo.ShowDevice(_id)

        if (!foundDevice) {
            throw new NotFoundError('No device found');
        }

        if (foundDevice.userId!==payload.userId)
        {throw new ForbiddenError("Data to be modified not yours");}

        await DevicesRepo.DeleteDevice(deviceId)

    },

    async deleteAllDevices(userId: ObjectId, iat: number) {
        const user = await UsersRepo.ShowUser(userId.toString())
        if (!user) {
            throw new NotFoundError('Wrong User Id')
        }

        const res = await DevicesRepo.DeleteAllDevices(userId, iat)
        if (!res) {
            throw new CustomError('Unexpected exception', HttpStatuses.ServerError, [{
                message: 'No delete happened in repo',
                field: 'null'
            }])
        }
    }
}