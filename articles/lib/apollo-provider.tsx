'use client';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr';
import { ReactNode } from 'react';

function makeClient() {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://hasura.rudixops.dev/v1/graphql',
    cache: new InMemoryCache(),
  });
}

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
