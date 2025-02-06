import {BlogDBType} from "../Data Types/BlogDBType";
import {PostDBType} from "../Data Types/PostDBType";

export type DBType = {
    blogs: BlogDBType[];
    posts: PostDBType[];
}

export const db: DBType = {
    blogs: [],
    posts: [],
}

export const setDB = (blogset?: BlogDBType, postset?: PostDBType) => {
    if (!blogset) {
        db.blogs = []
    }
   else { db.blogs = [blogset]}

    if (!postset) {
        db.posts = []
    }
    else { db.posts = [postset]}

}