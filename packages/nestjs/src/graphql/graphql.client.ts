import { GraphQLClient, Variables } from 'graphql-request';
import { isError, tryF } from 'ts-try';
import retry from 'async-retry';
import { GraphQLPaginableField, GraphQLPaginationRequest } from './graphql.types';

export class GraphQLPaginationClient extends GraphQLClient {
  public async *paginate<R extends GraphQLPaginableField, A extends string = string, V = Variables>(
    { document, variables, requestHeaders }: GraphQLPaginationRequest<V>,
    accessor: A,
    limit = 1000,
  ): AsyncIterable<R[]> {
    let cursor: string | undefined = '';

    while (cursor !== undefined) {
      const result = await tryF(() =>
        retry(
          () =>
            this.request<Record<A, R[]>, V>(
              document,
              { ...variables, cursor, limit } as V,
              requestHeaders,
            ),
          {
            retries: 3,
          },
        ),
      );

      // Do smth w/ the error
      if (isError(result)) {
        throw result;
      }

      const fields = result[accessor];

      // return partial results
      yield fields;

      cursor = fields.length === limit ? fields[fields.length - 1].id : undefined;
    }
  }
}
