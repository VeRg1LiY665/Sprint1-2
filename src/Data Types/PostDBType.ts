import {ObjectId} from "mongodb";

export class NewestLike {
    constructor(
        public addedAt: string,
        public userId: string,
        public login: string
    ){}
}

export class PostDBType {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string,
            newestLikes: NewestLike[]
        }
    ){}
}

