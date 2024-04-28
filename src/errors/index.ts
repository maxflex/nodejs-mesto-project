export class RouteNotExistsError extends Error {
  constructor(message: string = 'Маршрут не существует') {
    super(message);
  }
}

export default RouteNotExistsError;
