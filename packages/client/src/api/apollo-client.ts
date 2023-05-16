import {
  ApolloClient,
  createHttpLink,
  ApolloLink,
  InMemoryCache,
  gql,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import { UserContextType } from '../auth/user-context';
import { ClientLogger } from '../client-logger';
import { getEnvVar } from './utils';
import { ROUTES } from '@src/Routes';

export interface ApolloClientContext {
  userContext?: UserContextType;
  endPoint?: 'api';
  noAuth?: boolean;
}

export const apiContext = (
  userContext: UserContextType,
): ApolloClientContext => {
  return {
    endPoint: 'api',
    userContext,
  };
};

const DEBUG = true;
const VITE_SERVER_API_URL = getEnvVar('VITE_API_URL');

ClientLogger.log(
  'Loading API',
  `apollo endpoint for api = ${VITE_SERVER_API_URL}`,
);

interface CurrentClient {
  apolloClient: ApolloClient<any>;
}

let singleton: CurrentClient | null = null;

// https://www.apollographql.com/docs/link/composition/
export const getApolloClient = () => {
  if (singleton) {
    DEBUG &&
      ClientLogger.debug('getApolloClient', 'Returning existing apolloClient');
    return singleton.apolloClient;
  }
  DEBUG && ClientLogger.debug('getApolloClient', 'creating new apolloClient');

  const errorLink = onError(
    ({ graphQLErrors, networkError, response, operation }) => {
      ClientLogger.error('getApolloClient', 'graphQLErrors', {
        graphQLErrors,
        networkError,
        response,
        operation,
      });
      if (graphQLErrors) {
        DEBUG &&
          ClientLogger.debug('apollo-client', 'graphQLErrors', {
            graphQLErrors,
          });
        graphQLErrors.forEach(({ extensions, message, locations, path }) => {
          ClientLogger.error(
            'apollo-client.getApolloClient',
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          );
          if (message === 'Authentication required') {
            ClientLogger.error(
              'apollo-client.getApolloClient',
              `detected unauthenticated - why was this not picked up by token-refresh?}`,
            );
            if (singleton) {
              logout();
            }
          }
        });
      }
      if (networkError) {
        if (
          networkError.name &&
          networkError.name.indexOf('Error writing result to store for query') >
            -1
        ) {
          ClientLogger.log(
            'getApolloClient',
            'Error writing result to store for query detected. Assumed to be a faulty cache.',
          );
        }
        ClientLogger.log(
          'getApolloClient',
          `Network error: ${JSON.stringify(networkError)}`,
        );
      }
    },
  );

  let apiLinks = ApolloLink.from([
    errorLink,
    createHttpLink({
      uri: VITE_SERVER_API_URL,
      credentials: 'include',
    }),
  ]);

  singleton = {
    apolloClient: new ApolloClient({
      link: apiLinks,
      cache: new InMemoryCache({
        typePolicies: { Form: { keyFields: ['name'] } },
      }),
      connectToDevTools: true,
    }),
  };
  return singleton?.apolloClient;
};

export const logout = async () => {
  const mutate = singleton?.apolloClient.mutate;
  // hoisted up the dependency chain to avoid circular dependencies
  DEBUG && ClientLogger.debug('apollo-client', `started`, { mutate });
  if (mutate) {
    const resp = await mutate({
      mutation: gql`
        mutation logout {
          logout {
            success
          }
        }
      `,
      fetchPolicy: 'network-only',
    });
    DEBUG && ClientLogger.debug('apollo-client', 'Response', resp);
    window.location.href = ROUTES.LOGIN;
  }
};
