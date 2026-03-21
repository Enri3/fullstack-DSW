import { Request, Response } from 'express';

const mockGetRepository = jest.fn();

jest.mock('../../src/database', () => ({
  AppDataSource: {
    getRepository: (...args: unknown[]) => mockGetRepository(...args),
  },
}));

import { getNombreTipo } from '../../src/controllers/tipo_clientesController';
import { getAllProductos } from '../../src/controllers/descuentosController';

const buildRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Controllers unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getNombreTipo devuelve 400 si falta idTipoCli', async () => {
    const req = { params: {} } as unknown as Request;
    const res = buildRes();

    await getNombreTipo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Falta el idTipoCli' });
  });

  test('getNombreTipo devuelve 404 si no existe el tipo', async () => {
    mockGetRepository.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });

    const req = { params: { idTipoCli: '999' } } as unknown as Request;
    const res = buildRes();

    await getNombreTipo(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tipo de cliente no encontrado' });
  });

  test('getNombreTipo devuelve nombreTipoCli cuando existe', async () => {
    mockGetRepository.mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ idTipoCli: 2, nombreTipo: 'Cliente' }),
    });

    const req = { params: { idTipoCli: '2' } } as unknown as Request;
    const res = buildRes();

    await getNombreTipo(req, res);

    expect(res.json).toHaveBeenCalledWith({ nombreTipoCli: 'Cliente' });
  });

  test('getAllProductos devuelve listado de productos', async () => {
    mockGetRepository.mockReturnValue({
      find: jest.fn().mockResolvedValue([{ idProd: 1, nombreProd: 'Arroz' }]),
    });

    const req = {} as Request;
    const res = buildRes();

    await getAllProductos(req, res);

    expect(res.json).toHaveBeenCalledWith([{ idProd: 1, nombreProd: 'Arroz' }]);
  });
});
