import {MongoMemoryServer} from "mongodb-memory-server";
import {DB} from "../src/db/mongoDB";
import {req} from "./test-helpers";
import {SETTINGS} from "../src/settings";
import {ObjectId} from "mongodb";
import {createBlog} from "./utils/createBlogs";
import {testingDtosCreator} from "./utils/testingDtosCreator";
import {app} from "../src/app";
import {createUser, createUsers} from "./utils/createUsers";
import request from "supertest";
import {createPost} from "./utils/createPosts";

describe('/comments', () => {
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

    it('shouldn\'t find comment, STATUS:404', async () => {

        const res = await req
            .get(SETTINGS.PATH.COMMENTS + '/' + new ObjectId())
            .expect(404)

    })

    it('should  not create comment for specific post, STATUS:401', async () => {
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

        const comment = testingDtosCreator.createCommentDto({})

        const resp = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `)
            .send(comment)
            .expect(401);
    })

    it('should create comment for specific post, STATUS:200', async () => {
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

const comment = testingDtosCreator.createCommentDto({})

const resp = await request(app)
    .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
    .set('Authorization', `Bearer `+ATokens[0])
    .send(comment)
    .expect(201);
    })

    it('should show specific comment, STATUS:200', async () => {
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

        const comment = testingDtosCreator.createCommentDto({})

        const resp = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        const result = await request(app)
            .get(SETTINGS.PATH.COMMENTS + '/' + resp.body.id)
            .expect(200)

        expect(result.body).toEqual(resp.body)
    })

    it('should delete specific comment, STATUS:204', async () => {
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

        const comment = testingDtosCreator.createCommentDto({})

        const resp = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        const result = await req
            .delete(SETTINGS.PATH.COMMENTS + '/' + resp.body.id)
            .set('Authorization', `Bearer `+ATokens[0])
            .expect(204)

    })

    it('should not delete non-existent comment, STATUS:404', async () => {
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

        const comment = testingDtosCreator.createCommentDto({})

        const resp = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        const result = await req
            .delete(SETTINGS.PATH.COMMENTS + '/' + (new ObjectId()).toString())
            .set('Authorization', `Bearer `+ATokens[0])
            .expect(404)

    })

    it('should update comment for specific post, STATUS:204', async () => {
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

        const comment = testingDtosCreator.createCommentDto({})

        const resp = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        comment.content='updated test content for comment'

        await request(app)
            .put(SETTINGS.PATH.COMMENTS + '/' + resp.body.id)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(204);
    })

    it('should not update comment for specific post of other user, STATUS:403', async () => {
        ATokens=[]

        const blog = await createBlog(app)
        const newPost = await createPost(app, blog.id)
        const users = await createUsers(app, 1)

        for (let i = 0; i < 2; i++) {
            const res = await request(app)
                .post(SETTINGS.PATH.AUTH + '/login')
                .set('user-agent', 'Agent')
                .send({
                    loginOrEmail: users[i].login,
                    password: '12345678',
                })
                .expect(200);

            expect(res.body.accessToken).toContain('.');
            expect(res.headers['set-cookie']).toBeDefined();

            ATokens.push(res.body.accessToken);
        }

        const comment = testingDtosCreator.createCommentDto({})

        const resp = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        comment.content='updated test content for comment'

        await request(app)
            .put(SETTINGS.PATH.COMMENTS + '/' + resp.body.id)
            .set('Authorization', `Bearer `+ATokens[1])
            .send(comment)
            .expect(403);
    })
})
//TODO сделать тесты на лайки тут
/*
describe('comments/commentId/like-status', () => {
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

    it('should create like for specific comment, STATUS:200', async () => {
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

        const comment = testingDtosCreator.createCommentDto({})

        const resp = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);


    })
})*/
