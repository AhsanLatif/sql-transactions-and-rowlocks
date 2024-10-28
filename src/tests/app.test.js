const request = require('supertest');
const app = require("../app");
describe('get all unpaid jobs belong to Client', () => {
    it('get all unpaid jobs belong to Client', async () => {
        const resp = await request(app).get(`/jobs/unpaid`).set({ profile_id: 7 });
        expect(resp.status).toEqual(200);
        expect(resp.body.length).toEqual(1);
    })
})
describe('get all contracts', () => {
    it('get all unpaid jobs belong to Client', async () => {
        const resp = await request(app).get(`/contracts`).set({ profile_id: 4 });
        expect(resp.status).toEqual(200);
        expect(resp.body.length).toEqual(3);
    })
})