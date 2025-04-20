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

    it('shouldn`t find comment, STATUS:404', async () => {

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

    it('should create like for specific comment, STATUS:204', async () => {
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

        const ResultingComment = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        await request(app)
            .put(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Like'})
            .expect(204)
    })

    it('should not create like for specific comment with incorrect input data, STATUS:400', async () => {
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

        const ResultingComment = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        await request(app)
            .put(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Loik'})
            .expect(400)
    })

    it('should not create like for specific comment without authorization, STATUS:401', async () => {
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

        const ResultingComment = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        await request(app)
            .put(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}` + '/like-status')
            .set('Authorization', `Bearer `)
            .send({likeStatus:'Like'})
            .expect(401)
    })

    it('should not create like for non-existent comment, STATUS:404', async () => {
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
            .put(SETTINGS.PATH.COMMENTS + `/${testId}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Like'})
            .expect(404)
    })

    it('should cancel like for specific comment, STATUS:200', async () => {
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

        const ResultingComment = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        await request(app)
            .put(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Like'})
            .expect(204)

        const likedComment = await request(app)
            .get(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}`)
            .set('Authorization', `Bearer `+ATokens[0])
            .expect(200)

        expect(likedComment.body.likesInfo.likesCount).toEqual(1)

        await request(app)
            .put(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Dislike'})
            .expect(204)

        const dislikedComment = await request(app)
            .get(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}`)
            .set('Authorization', `Bearer `+ATokens[0])
            .expect(200)

        expect(dislikedComment.body.likesInfo.likesCount).toEqual(0)
        expect(dislikedComment.body.likesInfo.dislikesCount).toEqual(1)
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

        const comment = testingDtosCreator.createCommentDto({})

        const ResultingComment = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        await request(app)
            .put(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Like'})
            .expect(204)

        const likedComment = await request(app)
            .get(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}`)
            .set('Authorization', `Bearer `+ATokens[0])
            .expect(200)

        expect(likedComment.body.likesInfo.likesCount).toEqual(1)
        expect(likedComment.body.likesInfo.myStatus).toEqual('Like')
    })

    it('should show likeStatus = none for non authorized user, STATUS:200', async () => {
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

        const ResultingComment = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        await request(app)
            .put(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Like'})
            .expect(204)

        const likedComment = await request(app)
            .get(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}`)
            .expect(200)

        expect(likedComment.body.likesInfo.likesCount).toEqual(1)
        expect(likedComment.body.likesInfo.myStatus).toEqual('None')
    })

    it('should show likeStatus = None, Like for specific post`s comments , STATUS:200', async () => {
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

        const comments = testingDtosCreator.createCommentDtos(1)
        let ResultingComments =[]

        for (let i =0; i<2; i++) {
            ResultingComments[i] = await request(app)
                .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
                .set('Authorization', `Bearer ` + ATokens[0])
                .send(comments[i])
                .expect(201);
        }

        await request(app)
            .put(SETTINGS.PATH.COMMENTS + `/${ResultingComments[1].body.id}` + '/like-status')
            .set('Authorization', `Bearer `+ATokens[0])
            .send({likeStatus:'Like'})
            .expect(204)

        const LikedComments = await request(app)
            .get(SETTINGS.PATH.POSTS + `/${newPost.id}` + '/comments')
            .set('Authorization', `Bearer `+ATokens[0])
            .expect(200)

        expect(LikedComments.body.items[1].likesInfo.myStatus).toEqual('None')
        expect(LikedComments.body.items[0].likesInfo.myStatus).toEqual('Like')
    })

    it('should create likes/dislikes for specific comment by 4 different users, STATUS:200', async () => {
        ATokens=[]

        const blog = await createBlog(app)
        const newPost = await createPost(app, blog.id)

        await createUsers(app,3);  //create 4 users


        for (let i = 0; i < 4; i++) {
            const res = await request(app)
                .post(SETTINGS.PATH.AUTH + '/login')
                .set('user-agent', 'Agent' + i)
                .send({
                    loginOrEmail: `test${i}`,
                    password: '12345678'
                })
                .expect(200);

            expect(res.body.accessToken).toContain('.');
            expect(res.headers['set-cookie']).toBeDefined();

            ATokens.push(res.body.accessToken);
        }

        const comment = testingDtosCreator.createCommentDto({})

        const ResultingComment = await request(app)
            .post(SETTINGS.PATH.POSTS + '/' + newPost.id + SETTINGS.PATH.COMMENTS)
            .set('Authorization', `Bearer `+ATokens[0])
            .send(comment)
            .expect(201);

        for (let i = 0; i < 4; i++ ) {
            await request(app)
                .put(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}` + '/like-status')
                .set('Authorization', `Bearer `+ATokens[i])
                .send({likeStatus: (i%2==0) ? 'Like' : 'Dislike'})
                .expect(204)
        }

        for (let i = 0 ; i<4; i++) {
            const Comment = await request(app)
                .get(SETTINGS.PATH.COMMENTS + `/${ResultingComment.body.id}`)
                .set('Authorization', `Bearer `+ATokens[i])
                .expect(200)

            expect(Comment.body.likesInfo.likesCount).toEqual(2)
            expect(Comment.body.likesInfo.dislikesCount).toEqual(2)
            expect(Comment.body.likesInfo.myStatus).toEqual((i%2==0) ? 'Like' : 'Dislike')
        }

    })

})
