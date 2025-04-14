import {UsersRepo} from "../../Repositories/UsersRepo";
import {CustomError, ForbiddenError, HttpStatuses, NotFoundError} from "../../helpers/ErrorHandler";
import {JwtService} from "../../Auth/Services/JwtService";
import {DevicesRepo} from "../Repositories/DevicesRepo";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class DevicesServices {
    constructor(protected jwtService: JwtService,
                protected devicesRepo: DevicesRepo,
                protected usersRepo: UsersRepo,) {}

    async deleteDevice(deviceId: string, RToken: string): Promise<void> {
        const payload = await this.jwtService.verifyRToken(RToken)

        const _id = new ObjectId(deviceId)
        const foundDevice = await this.devicesRepo.ShowDevice(_id)

        if (!foundDevice) {
            throw new NotFoundError('No device found');
        }

        if (foundDevice.userId.toString()!==payload.userId.toString())  //НИКОГДА В БУДУЩЕМ не передавать ObjectId, бросать стринги
        {throw new ForbiddenError("Data to be modified not yours");}

        await this.devicesRepo.DeleteDevice(deviceId)

    }

    async deleteAllDevices(userId: ObjectId, iat: number) {
        const user = await this.usersRepo.ShowUser(userId.toString())
        if (!user) {
            throw new NotFoundError('Wrong User Id')
        }

        const res = await this.devicesRepo.DeleteAllDevices(userId, iat)
        if (!res) {
            throw new CustomError('Unexpected exception', HttpStatuses.ServerError, [{
                message: 'No delete happened in repo',
                field: 'null'
            }])
        }
    }
}


