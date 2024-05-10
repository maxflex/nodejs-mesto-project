/* eslint-disable max-classes-per-file */

export class RouteNotExistsError extends Error {
  constructor(message: string = 'Маршрут не существует') {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Неавторизован') {
    super(message);
  }
}
