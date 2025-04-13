import {DevicesOutputType} from "../../IO Types/DevicesOutputType";
import {DeviceDBType} from "../../Data Types/DeviceDBType";
import {devicesCollection} from "../../db/mongoDB";
import {ObjectId} from "mongodb";

export class DevicesQRepo {
    async showAllDevices(userId:ObjectId): Promise<DevicesOutputType[]> {
        const AllDevices = await devicesCollection
            .find({userId})
            .toArray();

        return AllDevices.map(el => (this.mapToOutput(el)))
    }

    mapToOutput(device: DeviceDBType): DevicesOutputType {
        let MappedDevice: any =
            {deviceId: (device._id).toString(),
                ip: device.ip,
                title: device.title,
                lastActiveDate: new Date(device.iat * 1000).toISOString(),
            }

        return MappedDevice as DevicesOutputType
    }
}

/*
export const DevicesQRepo ={
    async showAllDevices(userId:ObjectId): Promise<DevicesOutputType[]> {
    const AllDevices = await devicesCollection
    .find({userId})
    .toArray();

    return AllDevices.map(el => (this.mapToOutput(el)))
    },

    mapToOutput(device: DeviceDBType): DevicesOutputType {
        let MappedDevice: any =
            {deviceId: (device._id).toString(),
             ip: device.ip,
             title: device.title,
             lastActiveDate: new Date(device.iat * 1000).toISOString(),
            }

        return MappedDevice as DevicesOutputType
    },
}*/
