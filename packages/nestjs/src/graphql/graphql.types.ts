import { RequestDocument, Variables } from 'graphql-request';

export interface GraphQLPaginableField {
  id: string;
}

export interface GraphQLPaginationRequest<V = Variables> {
  document: RequestDocument;
  variables?: V;
  requestHeaders?: HeadersInit;
}

export type PaginationVariables<V extends Variables> = V & {
  cursor: string | undefined;
  limit: number;
};
