import { RequestDocument, Variables } from 'graphql-request';

export interface GraphQLPaginableField {
  id: string;
}

export interface GraphQLPaginationRequest<V = Variables> {
  document: RequestDocument;
  variables?: V;
  requestHeaders?: HeadersInit;
}
