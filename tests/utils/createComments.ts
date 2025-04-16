import {testingDtosCreator} from "./testingDtosCreator";
import request from "supertest";
import {SETTINGS} from "../../src/settings";
import {InputCommentType} from "../../src/IO Types/InputCommentType";

export const createComment = async (app: any, blog?: InputCommentType) => {
    const dto = blog ?? testingDtosCreator.createCommentDto({});

    const resp = await request(app)
        .post(SETTINGS.PATH.COMMENTS)
        .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
        .send(dto)
        .expect(201);
    return resp.body;
};