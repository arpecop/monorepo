'use client';

import { ApolloClient, InMemoryCache, ApolloProvider as Provider } from '@apollo/client';
import { ReactNode } from 'react';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://hasura.rudixops.dev/v1/graphql',
  cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: { children: ReactNode }) {
  return <Provider client={client}>{children}</Provider>;
}
