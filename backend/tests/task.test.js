// const request = require('supertest'); const app = require('../app'); describe('GET /api/tasks', () => { it('should return 200', async () => { const res = await request(app).get('/api/tasks'); expect(res.statusCode).toBe(200); }); });

const request = require('supertest');
const app = require('../app');

describe('Task API Integration', () => {
  let createdTaskId;

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Integration test task', completed: false });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdTaskId = res.body._id;
  });

  it('should fetch the created task', async () => {
    const res = await request(app).get(`/api/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Integration test task');
  });

  it('should delete the created task', async () => {
    const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(200);
  });
});
