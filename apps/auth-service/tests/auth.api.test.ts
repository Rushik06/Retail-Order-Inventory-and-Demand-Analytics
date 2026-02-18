import request from 'supertest';
import app from '../src/app.js';

describe('Auth API', () => {

  // REGISTER TESTS
  

  describe('POST /api/auth/register', () => {

    it('201 — should register successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User One',
          email: 'user1@test.com',
          password: 'secure123',
        });

      expect(res.status).toBe(201);
      expect(res.body).toBe('User One');
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe('user1@test.com');
      

      // ensure password is safety
      expect(res.body).not.toHaveProperty('password');
    });

    it('400 — missing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          password: 'secure123',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('400 — missing password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user2@test.com',
        });

      expect(res.status).toBe(400);
    });

    it('400 — invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'secure123',
        });

      expect(res.status).toBe(400);
    });

    it('409 — duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'dup@test.com',
          password: 'pass123',
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'dup@test.com',
          password: 'pass123',
        });

      expect(res.status).toBe(409);
    });

  });


  // LOGIN TESTS
 
  describe('POST /api/auth/login', () => {

    it('200 — should login successfully', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@test.com',
          password: 'pass123',
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'pass123',
        });

      expect(res.status).toBe(200);

      // token exists
      expect(res.body).toHaveProperty('token');

      // token format 
      expect(res.body.token.split('.')).toHaveLength(3);

      // user object
      expect(res.body.user.email).toBe('login@test.com');
      expect(res.body.user).toHaveProperty('role');
    });

    it('400 — missing email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'pass123',
        });

      expect(res.status).toBe(400);
    });

    it('400 — missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
        });

      expect(res.status).toBe(400);
    });

    it('401 — unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@test.com',
          password: 'pass123',
        });

      expect(res.status).toBe(401);
    });

    it('401 — wrong password', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'wrong@test.com',
          password: 'correctpass',
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@test.com',
          password: 'wrongpass',
        });

      expect(res.status).toBe(401);
    });

  });

});