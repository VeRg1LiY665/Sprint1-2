import {ReqDBType} from "../../Data Types/ReqDBType";
import {requestsCollection} from "../../db/mongoDB";

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

}