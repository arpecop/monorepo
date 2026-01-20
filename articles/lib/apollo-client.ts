import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

// Server-side Apollo Client (no auth for SSR)
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://hasura.rudixops.dev/v1/graphql',
    }),
  });
});

// Client-side Apollo Client with auth
export function createAuthApolloClient(token: string | null) {
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
}
