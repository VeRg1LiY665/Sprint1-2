import {req} from './test-helpers'
import {setDB} from '../src/db/db'
import {SETTINGS} from '../src/settings'
import {datasetblog, datasetpost} from "./datasets";
import {InputBlogType} from "../src/IO Types/InputBlogType";
import {InputPostType} from "../src/IO Types/InputPostType";


describe('/posts', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
         setDB()
     })

    it('should get empty array', async () => {
         setDB() // очистка базы данных

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

        console.log(res.body)

         expect(res.body.length).toBe(0)
    })
    it('should get not empty array', async () => {
         
        setDB(datasetblog,datasetpost)

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

        console.log(res.body[0])

         expect(res.body.length).toBe(1)
             expect(res.body[0]).toEqual(datasetpost)
    })

 it('should create', async () => {
         setDB(datasetblog)
         const newPost: InputPostType = {
             title: 'string',
             shortDescription: 'string',
             content: 'string',
             blogId: '543134656'
         }

         const res = await req
             .post(SETTINGS.PATH.POSTS)
             .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
             .send(newPost) // отправка данных
             .expect(201)

         console.log(res.body)

         expect(res.body.shortDescription).toEqual(newPost.shortDescription)
     })

    it('should delete', async () => {
        setDB(datasetblog, datasetpost)
        const res = await req
            .delete(SETTINGS.PATH.POSTS+'/564635496821')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .expect(204)

        console.log(res.body)
    })

     it('shouldn\'t find', async () => {
         const res = await req
             .get(SETTINGS.PATH.POSTS + '/1')
             .expect(404)
          console.log(res.body)

     })

    it('no auth', async () => {
        setDB(datasetblog)
        const newPost: InputPostType = {
            title: 'string',
            shortDescription: 'string',
            content: 'string',
            blogId: '543134656'
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .send(newPost) // отправка данных
            .expect(401)

    })

    it('Blog ID doesnt exist', async () => {
        setDB(datasetblog)
        const newPost: InputPostType = {
            title: 'string',
            shortDescription: 'string',
            content: 'string',
            blogId: '123745'
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(newPost) // отправка данных
            .expect(400)

    })
})