import request from 'supertest';
import { testingDtosCreator, UserDto } from './testingDtosCreator';
import {SETTINGS} from "../../src/settings";

export const createUser = async (app: any, userDto?: UserDto) => {
    const dto = userDto ?? testingDtosCreator.createUserDto({});

    const resp = await request(app)
        .post(SETTINGS.PATH.USERS)
        .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
        .send({
            login: dto.login,
            email: dto.email,
            password: dto.password,
        })
        .expect(201);
    return resp.body;
};

export const createUsers = async (app: any, count: number) => {
    const users = []
    const dtos = testingDtosCreator.createUserDtos(count);

    for (let i = 0; i <= count; i++) {
        const resp = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
            login: dtos[i].login,
            email: dtos[i].email,
            password: dtos[i].password
            })
            .expect(201);

        users.push(resp.body);
    }
    return users;
};