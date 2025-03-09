import {BlogDBType} from "../Data Types/BlogDBType";
import {PostDBType} from "../Data Types/PostDBType";
import {UserDBType} from "../Data Types/UserDBType";

export type DBType = {
    blogs: BlogDBType[];
    posts: PostDBType[];
    users: UserDBType[];
}

export const db: DBType = {
    blogs: [],
    posts: [],
    users: []
}

export const setDB = (blogset?: BlogDBType, postset?: PostDBType, userset?: UserDBType) => {
    if (!blogset) {
        db.blogs = []
    }
   else { db.blogs = [blogset]}

    if (!postset) {
        db.posts = []
    }
    else { db.posts = [postset]}

    if (!userset) {
        db.users = []
    }
    else { db.users = [userset]}

}