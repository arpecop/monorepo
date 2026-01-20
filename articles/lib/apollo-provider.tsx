'use client';

import { HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { ReactNode, useMemo } from 'react';
import { useAuth } from './auth-context';

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  
  const makeClient = useMemo(() => {
    return () => {
      const httpLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://hasura.rudixops.dev/v1/graphql',
      });

      const authLink = setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
        };
      });

      return new ApolloClient({
        cache: new InMemoryCache(),
        link: from([authLink, httpLink]),
      });
    };
  }, [token]);

  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
