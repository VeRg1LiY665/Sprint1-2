import {DBType, } from '../src/db/db'
import {BlogDBType} from "../src/Data Types/BlogDBType";
import {PostDBType} from "../src/Data Types/PostDBType";
import {ObjectId} from "mongodb";

// готовые данные для переиспользования в тестах

export const datasetblog: BlogDBType = {
    _id: new ObjectId(),
    name: 'blogname',
    description: 'Blog description',
    websiteUrl: 'https://www.validurl.com',
    createdAt: new Date().toISOString(),
    isMembership: false
}

export const datasetpost: PostDBType = {
    _id: new ObjectId(),
    title: 'Post title',
    shortDescription: 'Post description',
    content: 'Post content',
    blogId: datasetblog._id.toString(),
    blogName: 'blogname',
    createdAt: new Date().toISOString(),
}