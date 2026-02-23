/*eslint-disable*/ 
import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/config/index.js';

describe('Auth API', () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

 
  // REGISTER
 

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

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('User One');
      expect(res.body.email).toBe('user1@test.com');

      // password must not be returned
      expect(res.body).not.toHaveProperty('password');
    });

    it('400 — missing name', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'secure123',
        });

      expect(res.status).toBe(400);
    });

    it('400 — invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User',
          email: 'invalid-email',
          password: 'secure123',
        });

      expect(res.status).toBe(400);
    });

    it('409 — duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User',
          email: 'dup@test.com',
          password: 'secure123',
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User',
          email: 'dup@test.com',
          password: 'secure123',
        });

      expect(res.status).toBe(409);
    });

  });


  // LOGIN
 

  describe('POST /api/auth/login', () => {

    it('200 — should login successfully', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login User',
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
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');

      expect(res.body.user.email).toBe('login@test.com');
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
          name: 'Wrong User',
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

  
  // REFRESH
 

  describe('POST /api/auth/refresh', () => {

    it('200 — should refresh token', async () => {
      const register = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Refresh User',
          email: 'refresh@test.com',
          password: 'pass123',
        });

      const login = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'refresh@test.com',
          password: 'pass123',
        });

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: login.body.refreshToken,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    it('400 — missing refreshToken', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(res.status).toBe(400);
    });

  });


  // LOGOUT


  describe('POST /api/auth/logout', () => {

    it('200 — should logout successfully', async () => {
      const register = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Logout User',
          email: 'logout@test.com',
          password: 'pass123',
        });

      const login = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logout@test.com',
          password: 'pass123',
        });

      const res = await request(app)
        .post('/api/auth/logout')
        .send({
          refreshToken: login.body.refreshToken,
        });

      expect(res.status).toBe(200);
    });

    it('400 — missing refreshToken', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send({});

      expect(res.status).toBe(400);
    });

  });

});