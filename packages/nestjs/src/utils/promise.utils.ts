/**
 * Async iterator to promise array
 */
export async function asyncIterableToPromise<T>(iterable: AsyncIterable<T[]>): Promise<T[]> {
  let out: T[] = [];
  for await (const entities of iterable) {
    out = out.concat(entities);
  }
  return out;
}
