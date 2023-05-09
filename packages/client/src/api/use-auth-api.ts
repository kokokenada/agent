import {
  ApolloQueryResult,
  FetchResult,
  gql,
  QueryHookOptions,
} from '@apollo/client';
import { ClientLogger } from '../client-logger';

import { useApi } from './use-api';

const DEBUG = true;

export function useAuthApi() {
  const api = useApi();

  const loginMutation = gql`
    mutation tokenAuth($email: String!, $password: String!) {
      tokenAuth(email: $email, password: $password) {
        token
      }
    }
  `;
  return {
    async tokenAuth(email: string, password: string) {
      DEBUG && ClientLogger.debug('useAuthApi.tokenAuth', `started`);
      const resp = await api.mutate<any, any>({
        mutation: loginMutation,
        variables: { email, password },
        fetchPolicy: 'network-only',
      });
      DEBUG && ClientLogger.debug('useAuthApi.tokenAuth', 'Response', resp);
      return resp;
    },
  };
}
`
`;
