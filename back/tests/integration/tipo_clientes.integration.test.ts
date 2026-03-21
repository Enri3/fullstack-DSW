import express from 'express';
import request from 'supertest';

const mockGetRepository = jest.fn();

jest.mock('../../src/database', () => ({
  AppDataSource: {
    getRepository: (...args: unknown[]) => mockGetRepository(...args),
  },
}));

import tipoClientesRouter from '../../src/routes/tipo_clientes';

describe('Tipo clientes integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /obtener/:idTipoCli responde 200 con nombre del tipo', async () => {
    mockGetRepository.mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ idTipoCli: 2, nombreTipo: 'Cliente' }),
    });

    const app = express();
    app.use(express.json());
    app.use('/', tipoClientesRouter);

    const response = await request(app).get('/obtener/2');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ nombreTipoCli: 'Cliente' });
  });
});
