import {testingDtosCreator} from "./testingDtosCreator";
import request from "supertest";
import {SETTINGS} from "../../src/settings";
import {InputPostType} from "../../src/IO Types/InputPostType";

export const createPost = async (app: any, blogId:string, post?: InputPostType) => {
    const dto = post ?? testingDtosCreator.createPostDto({blogId:blogId});

    const resp = await request(app)
        .post(SETTINGS.PATH.POSTS)
        .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
        .send(dto)
        .expect(201);
    return resp.body;
};