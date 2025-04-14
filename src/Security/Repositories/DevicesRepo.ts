import {DeviceModel} from "../../db/mongoDB";
import {DeviceDBType} from "../../Data Types/DeviceDBType";
import {ObjectId} from "mongodb";

export class DevicesRepo  {
    async ShowDevice(_id: ObjectId): Promise<DeviceDBType | null >{
        let filter: any = {};
        filter._id = _id//.toString();  //какого собственно хрена это работает?

        const device:DeviceDBType | null =  await DeviceModel.findOne(filter)

        if(!device){
            return null
        }
        return device
    }

    async AddDevice(device:DeviceDBType): Promise<boolean> {
        const res = await DeviceModel.insertOne(device)
        return !!res._id; //двойное отрицание должно сработать - приводим к булю
    }

    async UpdateDevice(device:DeviceDBType): Promise<boolean> {

        let filter: any = {};
        filter._id = device._id.toString();
        const res = await DeviceModel.updateOne(
            filter, //тут смотреть, если опять не заработает!!!
            {$set:{...device}}
        )

        return res.matchedCount === 1;
    }

    async DeleteDevice(deviceId: string): Promise<boolean> {
        let filter: any = {};
        filter._id = deviceId.toString(); //и опять же - какого собственно хрена это работает?
        const res = await DeviceModel.deleteOne(filter);

        return res.deletedCount === 1
    }

    async DeleteAllDevices(userId:ObjectId, iat:number): Promise<boolean> {
        let filter: any = {};
        filter.userId = userId
        filter.iat = {$nin:[iat]}
        const res = await DeviceModel.deleteMany({$and:[filter]})

        return res.deletedCount>=1
    }
}

/*
export const DevicesRepo = {
    async ShowDevice(_id: ObjectId): Promise<DeviceDBType | null >{
        let filter: any = {};
        filter._id = _id.toString();  //какого собственно хрена это работает?

        const device:DeviceDBType | null =  await devicesCollection.findOne(filter)

        if(!device){
            return null
        }
        return device
    },

    async AddDevice(device:DeviceDBType): Promise<boolean> {
    const res = await devicesCollection.insertOne(device)
    return !!res.insertedId; //двойное отрицание должно сработать - приводим к булю
    },

    async UpdateDevice(device:DeviceDBType): Promise<boolean> {
        let filter: any = {};
        filter._id = device._id.toString();
        const res = await devicesCollection.updateOne(
            filter, //тут смотреть, если опять не заработает!!!
            {$set:{...device}}
        )

        return res.matchedCount === 1;
    },

    async DeleteDevice(deviceId: string): Promise<boolean> {
        let filter: any = {};
        filter._id = deviceId//.toString(); //и опять же - какого собственно хрена это работает?
        const res = await devicesCollection.deleteOne(filter);

        return res.deletedCount === 1
    },

    async DeleteAllDevices(userId:ObjectId, iat:number): Promise<boolean> {
        let filter: any = {};
        filter.userId = userId
        filter.iat = {$nin:[iat]}
    const res = await devicesCollection.deleteMany({$and:[filter]})

    return res.deletedCount>=1
    }


}*/
