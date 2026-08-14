import express from 'express';
import request from 'supertest';
import { WebServer } from '../server';

describe('Milestone 10A: Web Server & API Layer', () => {
  let app: express.Application;

  beforeAll(() => {
    // Instantiate WebServer instance routes via private app access or integration test
    const server = new WebServer(3001);
    // @ts-ignore
    app = server.app;
  });

  test('GET /api/career returns career state', async () => {
    const res = await request(app).get('/api/career');
    expect(res.status).toBe(200);
    expect(res.body.player).toBeDefined();
    expect(res.body.player.name).toBe('Alex Hunter');
  });

  test('GET /api/player returns player attributes and archetype', async () => {
    const res = await request(app).get('/api/player');
    expect(res.status).toBe(200);
    expect(res.body.player.attributes).toBeDefined();
    expect(res.body.archetype).toBeDefined();
  });

  test('POST /api/training updates player overall rating', async () => {
    const res = await request(app)
      .post('/api/training')
      .send({ focus: 'Finishing' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
