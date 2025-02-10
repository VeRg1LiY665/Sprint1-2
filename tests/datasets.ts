import {DBType, } from '../src/db/db'
import {BlogDBType} from "../src/Data Types/BlogDBType";
import {PostDBType} from "../src/Data Types/PostDBType";

// готовые данные для переиспользования в тестах

export const datasetblog: BlogDBType = {
    id: '543134656',
    name: 'blogname',
    description: 'Blog description',
    websiteUrl: 'https://www.validurl.com'
}

export const datasetpost: PostDBType = {
    id: '564635496821',
    title: 'Post title',
    shortDescription: 'Post description',
    content: 'Post content',
    blogId: '543134656',
    blogName: 'blogname'
}