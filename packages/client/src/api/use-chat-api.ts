import {
  ApolloQueryResult,
  FetchResult,
  gql,
  QueryHookOptions,
} from '@apollo/client';
import { ClientLogger } from '../client-logger';

import { useApi } from './use-api';

export const CHAT_FIELDS = gql`
  fragment ChatFragment on Chat {
    id
    name
  }
`;

const DEBUG = true;

export function useChatApi() {
  const api = useApi();

  const chatsQuery = gql`
    ${CHAT_FIELDS}
    query myChats {
      myChats {
        ...ChatFragment
      }
    }
  `;
  return {
    async myChats() {
      DEBUG && ClientLogger.debug('useChatApi.chats', `started`);
      const resp = await api.query<any, any>({
        query: chatsQuery,
        variables: {},
        fetchPolicy: 'network-only',
      });
      DEBUG && ClientLogger.debug('useCsaApi.getMe', 'Response', resp);
      return resp;
    },
  };
}
