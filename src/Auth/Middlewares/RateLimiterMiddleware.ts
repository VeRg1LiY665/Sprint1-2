import {Request, Response, NextFunction} from "express";
import {RequestsRepo} from "../../Security/Repositories/RequestsRepo";
import {ObjectId} from "mongodb";

export const rateLimiter = async (req:Request, res:Response, next:NextFunction) => {
    //TODO спросить про redis
    let ip:string = req.ip ? req.ip : '0.0.0.0' // опять костыль - все еще не знаю, что делать если ip не прочитали

    const RequestToApi = {
        _id : new ObjectId(),
        ip : ip,
        URL : req.baseUrl,
        date: new Date()
    }

    const ReqLimit = 5; // Max requests
    const TimeLimit = 10 * 1000; // 10 sec

    const DateToSearch = new Date(RequestToApi.date.getTime()-TimeLimit) // convert date -> ms, subtract 10 sec in ms, convert ms->date
    //const DateToSearch = RequestToApi.date.getTime()/1000 - TimeLimit //time in sec

    await RequestsRepo.AddRequest(RequestToApi)
    const requests = await RequestsRepo.ShowRequests({ip: RequestToApi.ip, URL: RequestToApi.URL, DateToSearch:DateToSearch})

    if (requests.length > ReqLimit) {
        res.status(429).json({ message: 'Too many requests, try again later.' });
    }

    next();
};