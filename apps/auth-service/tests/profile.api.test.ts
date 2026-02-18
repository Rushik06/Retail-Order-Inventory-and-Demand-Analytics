/*eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app.js';

vi.mock('../src/middleware/auth.middleware.js', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { id: '1' };
    next();
  },
}));

describe('Profile API', () => {

  it('GET /api/profile — should return profile', async () => {
    const res = await request(app)
      .get('/api/profile');

    expect(res.status).toBe(200);
  });

  it('PATCH /api/profile — should update profile', async () => {
    const res = await request(app)
      .patch('/api/profile')
      .send({ name: 'Updated' });

    expect(res.status).toBe(200);
  });

  it('DELETE /api/profile — should delete account', async () => {
    const res = await request(app)
      .delete('/api/profile');

    expect(res.status).toBe(200);
  });

});