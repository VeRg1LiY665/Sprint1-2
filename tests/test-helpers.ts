import {app} from '../src/app'
import {agent} from 'supertest'

export const req = agent(app)

export function delay(timeDelay:number) {
    let start_time = Date.now();
    while (Date.now() - start_time < timeDelay);
}