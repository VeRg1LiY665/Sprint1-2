import {InputBlogType} from "../../src/IO Types/InputBlogType";
import {testingDtosCreator} from "./testingDtosCreator";
import request from "supertest";
import {SETTINGS} from "../../src/settings";

export const createComment = async (app: any, blog?: InputBlogType) => {
    const dto = blog ?? testingDtosCreator.createBlogDto({});

    const resp = await request(app)
        .post(SETTINGS.PATH.BLOGS)
        .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
        .send(dto)
        .expect(201);
    return resp.body;
};