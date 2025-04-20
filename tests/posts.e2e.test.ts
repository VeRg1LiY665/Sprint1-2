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
import {createUser} from "./utils/createUsers";


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

describe('posts/postId/like-status', () => {
    let db: any
    let ATokens:any = []

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

    it('should create like for specific post, STATUS:204', async () => {
        ATokens=[]

        const blog = await createBlog(app)
        const newPost = await createPost(app, blog.id)
        const user = await createUser(app)

        const res = await request(app)
            .post(SETTINGS.PATH.AUTH + '/login')
            .set('user-agent', 'Agent')
            .send({
                loginOrEmail: user.login,
                password: '123456789',
            })
            .expect(200);

        expect(res.body.accessToken).toContain('.');
        expect(res.headers['set-cookie']).toBeDefined();

        ATokens.push(res.body.accessToken);

        await request(app)
            .put(SETTINGS.PATH.POSTS + `/${newPost.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Like'})
            .expect(204)

        const likedPost = await request(app)
            .get(SETTINGS.PATH.POSTS+`/${newPost.id}`)
            .expect(200);

        expect(likedPost.body.extendedLikesInfo.likesCount).toEqual(1)
    })

    it('should not create like for specific blog with incorrect input data, STATUS:400', async () => {
        ATokens=[]

        const blog = await createBlog(app)
        const newPost = await createPost(app, blog.id)
        const user = await createUser(app)

        const res = await request(app)
            .post(SETTINGS.PATH.AUTH + '/login')
            .set('user-agent', 'Agent')
            .send({
                loginOrEmail: user.login,
                password: '123456789',
            })
            .expect(200);

        expect(res.body.accessToken).toContain('.');
        expect(res.headers['set-cookie']).toBeDefined();

        ATokens.push(res.body.accessToken);

        await request(app)
            .put(SETTINGS.PATH.POSTS + `/${newPost.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Loik'})
            .expect(204)
    })

    it('should not create like for specific post without authorization, STATUS:401', async () => {
        ATokens=[]

        const blog = await createBlog(app)
        const newPost = await createPost(app, blog.id)
        const user = await createUser(app)

        const res = await request(app)
            .post(SETTINGS.PATH.AUTH + '/login')
            .set('user-agent', 'Agent')
            .send({
                loginOrEmail: user.login,
                password: '123456789',
            })
            .expect(200);

        expect(res.body.accessToken).toContain('.');
        expect(res.headers['set-cookie']).toBeDefined();

        ATokens.push(res.body.accessToken);

        await request(app)
            .put(SETTINGS.PATH.POSTS + `/${newPost.id}` + '/like-status')
            .set('Authorization', `Bearer `)
            .send({likeStatus:'Like'})
            .expect(401)
    })

    it('should not create like for non-existent post, STATUS:404', async () => {
        ATokens=[]

        const user = await createUser(app)

        const res = await request(app)
            .post(SETTINGS.PATH.AUTH + '/login')
            .set('user-agent', 'Agent')
            .send({
                loginOrEmail: user.login,
                password: '123456789',
            })
            .expect(200);

        expect(res.body.accessToken).toContain('.');
        expect(res.headers['set-cookie']).toBeDefined();

        ATokens.push(res.body.accessToken);

        const testId = new ObjectId().toString()
        await request(app)
            .put(SETTINGS.PATH.POSTS + `/${testId}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Like'})
            .expect(404)
    })

    it('should cancel like for specific post, STATUS:200', async () => {
        ATokens=[]

        const blog = await createBlog(app)
        const newPost = await createPost(app, blog.id)
        const user = await createUser(app)

        const res = await request(app)
            .post(SETTINGS.PATH.AUTH + '/login')
            .set('user-agent', 'Agent')
            .send({
                loginOrEmail: user.login,
                password: '123456789',
            })
            .expect(200);

        expect(res.body.accessToken).toContain('.');
        expect(res.headers['set-cookie']).toBeDefined();

        ATokens.push(res.body.accessToken);

        await request(app)
            .put(SETTINGS.PATH.POSTS + `/${newPost.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Like'})
            .expect(204)

        const likedPost = await request(app)
            .get(SETTINGS.PATH.POSTS + `/${newPost.id}`)
            .set('Authorization', `Bearer `+ATokens[0])
            .expect(200)

        expect(likedPost.body.extendedLikesInfo.likesCount).toEqual(1)

        await request(app)
            .put(SETTINGS.PATH.POSTS + `/${newPost.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Dislike'})
            .expect(204)

        const dislikedPost = await request(app)
            .get(SETTINGS.PATH.POSTS + `/${newPost.id}`)
            .set('Authorization', `Bearer `+ATokens[0])
            .expect(200)

        expect(dislikedPost.body.extendedLikesInfo.likesCount).toEqual(0)
        expect(dislikedPost.body.extendedLikesInfo.dislikesCount).toEqual(1)
    })

    it('should show likeStatus for authorized user, STATUS:200', async () => {
        ATokens=[]

        const blog = await createBlog(app)
        const newPost = await createPost(app, blog.id)
        const user = await createUser(app)

        const res = await request(app)
            .post(SETTINGS.PATH.AUTH + '/login')
            .set('user-agent', 'Agent')
            .send({
                loginOrEmail: user.login,
                password: '123456789',
            })
            .expect(200);

        expect(res.body.accessToken).toContain('.');
        expect(res.headers['set-cookie']).toBeDefined();

        ATokens.push(res.body.accessToken);

        await request(app)
            .put(SETTINGS.PATH.POSTS + `/${newPost.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Like'})
            .expect(204)

        const likedPost = await request(app)
            .get(SETTINGS.PATH.POSTS + `/${newPost.id}`)
            .set('Authorization', `Bearer `+ATokens[0])
            .expect(200)

        expect(likedPost.body.extendedLikesInfo.likesCount).toEqual(1)
        expect(likedPost.body.extendedLikesInfo.myStatus).toEqual('Like')
    })
})