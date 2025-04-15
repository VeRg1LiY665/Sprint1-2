import {req} from './test-helpers'
import {SETTINGS} from '../src/settings'
import {MongoMemoryServer} from "mongodb-memory-server";
import {DB} from "../src/db/mongoDB";
import request from "supertest";
import {app} from "../src/app";
import {createBlog} from "./utils/createBlogs";
import {testingDtosCreator} from "./utils/testingDtosCreator";
import {createPost} from "./utils/createPosts";
import {ObjectId} from "mongodb";


describe('/posts', () => {
    let db:any

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        db = new DB(mongoServer.getUri())
        await db.runDB();
    });

    beforeEach(async () => {
        await db.drop();
    });

    afterAll(async () => {
        await db.stop();
    });

    afterAll((done) => {
        done();
    });

    it('should remove all data, STATUS:204', async()=>{
        await request(app)
            .delete('/testing/all-data/')
            .expect(204)
    })

    it('should get empty array, STATUS:200', async () => {

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

         expect(res.body.items.length).toBe(0)
    })

    it('should create post, STATUS:201', async () => {
        const blog = await createBlog(app)
        const newPost = testingDtosCreator.createPostDto({blogId:blog.id})

         const res = await req
             .post(SETTINGS.PATH.POSTS)
             .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
             .send(newPost) // отправка данных
             .expect(201)

         expect(res.body.shortDescription).toEqual(newPost.shortDescription)
     })

    it('should delete, STATUS:204', async () => {
        const blog = await createBlog(app)
        const post = await createPost(app, blog.id)

        const res = await req
            .delete(SETTINGS.PATH.POSTS+'/' + post.id)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .expect(204)

    })

    it('should not find, STATUS:404', async () => {
         const res = await req
             .get(SETTINGS.PATH.POSTS + '/' + new ObjectId())
             .expect(404)


     })

    it('no auth, STATUS:401', async () => {
        const blog = await createBlog(app)
        const newPost = testingDtosCreator.createPostDto({blogId:blog.id})

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .send(newPost) // отправка данных
            .expect(401)

    })

    it('Blog ID doesnt exist, STATUS:400', async () => {

        const newPost = testingDtosCreator.createPostDto({blogId: (new ObjectId()).toString()})

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(newPost) // отправка данных
            .expect(400)

    })
})