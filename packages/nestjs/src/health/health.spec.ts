import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HealthModule } from './health.module';
import { HealthCheckKey } from './health.types';
import {
  HealthIndicatorStatus,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

describe('HealthModule', () => {
  const httpCheckKey = 'some-other-check';

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        HealthModule.forRootAsync({
          useFactory: () => ({
            [HealthCheckKey.DATABASE]: { critical: true },
            [httpCheckKey]: { critical: false, url: 'any' },
          }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('triggers critical health check', async () => {
    const mock = { [HealthCheckKey.DATABASE]: { status: 'up' as HealthIndicatorStatus } };
    const spy = jest.spyOn(TypeOrmHealthIndicator.prototype, 'pingCheck').mockResolvedValue(mock);
    const response = await request(app.getHttpServer()).get('/health/critical');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual('ok');
    expect(response.body).toMatchObject({ details: mock });
    spy.mockRestore();
  });

  it('triggers noncritical http health check', async () => {
    const mock = { [httpCheckKey]: { status: 'up' as HealthIndicatorStatus } };
    const spy = jest.spyOn(HttpHealthIndicator.prototype, 'pingCheck').mockResolvedValue(mock);
    const response = await request(app.getHttpServer()).get('/health/noncritical');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual('ok');
    expect(response.body).toMatchObject({ details: mock });
    spy.mockRestore();
  });
});
