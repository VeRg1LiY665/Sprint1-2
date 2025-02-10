import {req} from './test-helpers'
import {setDB} from '../src/db/db'
import {SETTINGS} from '../src/settings'
import {datasetblog} from "./datasets";
import {InputBlogType} from "../src/IO Types/InputBlogType";


describe('/blogs', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
         setDB()
     })

    it('should get empty array', async () => {
         setDB() // очистка базы данных

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)

        console.log(res.body)

         expect(res.body.length).toBe(0)
    })
    it('should get not empty array', async () => {
         
        setDB(datasetblog)

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)

        console.log(res.body[0])

         expect(res.body.length).toBe(1)
             expect(res.body[0]).toEqual(datasetblog)
    })

 it('should create', async () => {
         setDB()
         const newBlog: InputBlogType = {
             name: 'string',
             description: 'string',
             websiteUrl: 'https://www.validurl.com',
         }

         const res = await req
             .post(SETTINGS.PATH.BLOGS)
             .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
             .send(newBlog) // отправка данных
             .expect(201)

         console.log(res.body)

         expect(res.body.description).toEqual(newBlog.description)
     })

    it('should delete', async () => {
        setDB(datasetblog)
        const res = await req
            .delete(SETTINGS.PATH.BLOGS+'/543134656')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .expect(204)

        console.log(res.body)
    })

     it('shouldn\'t find', async () => {
        //setDB(dataset1)
         //console.log(dataset1)
         const res = await req
             .get(SETTINGS.PATH.BLOGS + '/1')
             .expect(404)
          console.log(res.body)

     })

    it('no auth', async () => {
        setDB()
        const newBlog: InputBlogType = {
            name: 'string',
            description: 'string',
            websiteUrl: 'https://www.validurl.com',
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog) // отправка данных
            .expect(401)

    })
})