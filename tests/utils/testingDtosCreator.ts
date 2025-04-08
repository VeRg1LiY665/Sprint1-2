import {InputBlogType} from "../../src/IO Types/InputBlogType";

export type UserDto = {
    login: string
    email: string
    password: string
}


export const testingDtosCreator = {
    createUserDto({login, email, password}: {
        login?: string, email?: string, password?: string
    }): UserDto {
        return {
            login: login ?? 'test',
            email: email ?? 'test@gmail.com',
            password: password ?? '123456789',

        }
    },
    createUserDtos(count: number): UserDto[] {
        const users = [];

        for (let i = 0; i <= count; i++) {
            users.push({
                login: 'test' + i,
                email: 'test'+ i + '@gmail.com',
                password: '12345678'
            })
        }
        return users;
    },

    createBlogDto(content: Partial<InputBlogType>): InputBlogType {
        return {
            name: content.name ?? 'test',
            description: content.description ?? 'description example',
            websiteUrl: content.websiteUrl ?? 'www.example.com',

        }
    },

    createBlogDtos(count:number): InputBlogType[] {
        const blogs =[]

        for (let i = 0; i <= count; i++) {
            blogs.push({
                name: `testname${i}`,
                description: `description example for test blog №${i}`,
                websiteUrl: `www.example${i}.com`,

            })
        }
        return blogs
    }
}