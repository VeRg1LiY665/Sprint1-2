import {InputBlogType} from "../../src/IO Types/InputBlogType";
import {InputPostType} from "../../src/IO Types/InputPostType";
import {InputCommentType} from "../../src/IO Types/InputCommentType";

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
        return new InputBlogType(
            content.name ?? 'test',
            content.description ?? 'description example',
            content.websiteUrl ?? 'https://www.example.com',
    )
    },

    createBlogDtos(count:number): InputBlogType[] {
        const blogs =[]

        for (let i = 0; i <= count; i++) {
            blogs.push(new InputBlogType(
                `testname${i}`,
                `description example for test blog №${i}`,
               `www.example${i}.com`,
                )
            )
        }
        return blogs
    },

    createPostDto(content: Partial<InputPostType>): InputPostType {
        return new InputPostType(
            content.title ?? 'test',
            content.shortDescription ?? 'description example',
            content.content ?? 'example content',
            content.blogId ?? '',
        )
    },

    createPostDtos(count:number, blogId:string): InputPostType[] {
        const posts =[]

        for (let i = 0; i <= count; i++) {
            posts.push(new InputPostType(
                    `testTitle${i}`,
                    `description example for test post №${i}`,
                    `example content${i} for test post ${i}`,
                    blogId
                )
            )
        }
        return posts
    },

    createCommentDto(content: Partial<InputCommentType>): InputCommentType {
        return new InputCommentType(
            content.content ?? 'example content for comment',
        )
    },

    createCommentDtos(count:number): InputCommentType[] {
        const comments =[]

        for (let i = 0; i <= count; i++) {
            comments.push(new InputCommentType(
                    `example content${i} for test comment ${i}`
                )
            )
        }
        return comments
    },
}