import {ReqDBType} from "../../Data Types/ReqDBType";
import {ReqModel} from "../../db/mongoDB";
import {injectable} from "inversify";

@injectable()
export class RequestsRepo {
    async CountRequests(content: {ip:string, URL: string, DateToSearch:Date}): Promise<number> {
        const res = await ReqModel.countDocuments(
            {$and:[
                    {ip : content.ip},
                    {URL:content.URL},
                    {date: {$gte:content.DateToSearch}}
                ]}
        )

        return res
    }

    async AddRequest(content:ReqDBType):Promise<void> {
        await ReqModel.insertOne(content);
    }

    async DeleteRequestsForIpAndURL(content: Partial <ReqDBType>):Promise<void> { //почистить базу после срабатывания лимитера
        const res = await ReqModel.deleteMany({$and:[{ip : content.ip}, {URL:content.URL}]});
    }
}

/*
export const RequestsRepo = {
    async CountRequests(content: {ip:string, URL: string, DateToSearch:Date}): Promise<number> {
        const res = await requestsCollection.countDocuments(
            {$and:[
                {ip : content.ip},
                {URL:content.URL},
                {date: {$gte:content.DateToSearch}}
                ]}
        )

        return res
    },

    async AddRequest(content:ReqDBType):Promise<void> {
        await requestsCollection.insertOne(content);
    },

    async DeleteRequestsForIpAndURL(content: Partial <ReqDBType>):Promise<void> { //почистить базу после срабатывания лимитера
      const res = await requestsCollection.deleteMany({$and:[{ip : content.ip}, {URL:content.URL}]});
    }

}*/
