import {ReqDBType} from "../../Data Types/ReqDBType";
import {requestsCollection} from "../../db/mongoDB";

export const RequestsRepo = {
    async ShowRequests(content: {ip:string, URL: string, DateToSearch:Date}): Promise<ReqDBType[]> {
        const res = await requestsCollection.find(
            {$and:[{ip : content.ip}, {URL:content.URL}, {date: {$lte:content.DateToSearch}},]})
            .toArray()
        return res
    },

    async AddRequest(content:ReqDBType):Promise<void> {
        await requestsCollection.insertOne(content);
    },

    async DeleteRequestsForIpAndURL(content: Partial <ReqDBType>):Promise<void> { //почистить базу после срабатывания лимитера
      const res = await requestsCollection.deleteMany({$and:[{ip : content.ip}, {URL:content.URL}]});
    }

}