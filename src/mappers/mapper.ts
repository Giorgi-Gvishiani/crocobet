type MapDataReturnType<T, R> = T extends Array<any> ? R[] : R;

export class DataMapper {
  mapData<T, R>(
    payload: T | T[],
    mapper: (item: T) => R,
  ): MapDataReturnType<T, R> {
    if (Array.isArray(payload)) {
      return payload.map(mapper) as MapDataReturnType<T, R>;
    }

    return mapper(payload) as MapDataReturnType<T, R>;
  }
}
