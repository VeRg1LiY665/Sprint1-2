import {testingDtosCreator, UserDto} from "./testingDtosCreator";
import request from "supertest";
import {SETTINGS} from "../../src/settings";
import {InputBlogType} from "../../src/IO Types/InputBlogType";
//TODO доделать хэлпер на создание блогов
export const createBlog = async (app: any, blog?: InputBlogType) => {
    const dto = blog ?? testingDtosCreator.createBlogDto({});

    const resp = await request(app)
        .post(SETTINGS.PATH.BLOGS)
        .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
        .send({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
        })
        .expect(201);
    return resp.body;
};

export const createBlogs = async (app: any, count: number) => {
    const blogs = []
    const dtos = testingDtosCreator.createBlogDtos(count);

    for (let i = 0; i <= count; i++) {
        const resp = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                name: dtos[i].name,
                description: dtos[i].description,
                websiteUrl: dtos[i].websiteUrl,
            })
            .expect(201);

        blogs.push(resp.body);
    }
    return blogs;
};