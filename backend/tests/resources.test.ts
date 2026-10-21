import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../src/index';
import { createTestUser, resetDatabase, tokenFor } from './setup';

// Generated with the resource routers: every list pages and every write is validated.
const mounts = ['/api/order_items'];

describe('resource routers', () => {
  let auth = '';
  beforeEach(async () => {
    await resetDatabase();
    const { user } = await createTestUser();
    auth = `Bearer ${tokenFor(user.id)}`;
  });
  it.each(mounts)('%s rejects a bad write with 400', async (mount) => {
    const res = await request(app).post(mount + '/').set('Authorization', auth).send([]);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('validation_error');
  });
  it.each(mounts)('%s rejects a bad page and pages the list', async (mount) => {
    expect((await request(app).get(mount + '/?page=0').set('Authorization', auth)).status).toBe(400);
    const res = await request(app).get(mount + '/?page=1&pageSize=5').set('Authorization', auth);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ items: [], total: 0, page: 1, pageSize: 5 });
  });
});
