import {
  ApolloQueryResult,
  FetchResult,
  gql,
  QueryHookOptions,
} from '@apollo/client';
import { ClientLogger } from '../client-logger';

import { useApi } from './use-api';
import {
  CreateChatMessageMutation,
  createChatMutation,
  createChatMutationVariables,
  MutationcreateChatMessageArgs,
  chatMessagesQueryVariables,
  chatMessagesQuery,
} from './types';

export const CHAT_FIELDS = gql`
  fragment ChatFragment on Chat {
    id
    name
  }
`;

export const CHAT_MESSAGE_FIELDS = gql`
  fragment ChatMessageFragment on ChatMessage {
    id
    content
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

    async chatMessages(chatId: string) {
      DEBUG && ClientLogger.debug('useChatApi.messages', `started`);
      const resp = await api.query<
        chatMessagesQuery,
        chatMessagesQueryVariables
      >({
        query: gql`
          ${CHAT_MESSAGE_FIELDS}
          query chatMessages($chatId: ID!) {
            chatMessages(chatId: $chatId) {
              edges {
                node {
                  ...ChatMessageFragment
                }
              }
            }
          }
        `,
        variables: { chatId },
        fetchPolicy: 'network-only',
      });
      DEBUG && ClientLogger.debug('useChatApi.messages', 'Response', resp);
      return resp;
    },

    async createChat(name: string) {
      DEBUG && ClientLogger.debug('useChatApi.createChat', `started`);
      const resp = await api.mutate<
        createChatMutation,
        createChatMutationVariables
      >({
        mutation: gql`
          ${CHAT_FIELDS}
          mutation createChat($name: String!) {
            createChat(name: $name) {
              chat {
                ...ChatFragment
              }
            }
          }
        `,
        variables: { name },
      });
      DEBUG && ClientLogger.debug('useChatApi.createChat', 'Response', resp);
      return resp;
    },

    async createChatMessage(chatId: string, content: string) {
      DEBUG && ClientLogger.debug('useChatApi.createChat', `started`);
      const resp = await api.mutate<
        CreateChatMessageMutation,
        MutationcreateChatMessageArgs
      >({
        mutation: gql`
          ${CHAT_MESSAGE_FIELDS}
          mutation createChatMessage($chatId: ID!, $content: String!) {
            createChatMessage(chatId: $chatId, content: $content) {
              chatMessage {
                ...ChatMessageFragment
              }
            }
          }
        `,
        variables: { chatId, content },
      });
      DEBUG &&
        ClientLogger.debug('useChatApi.createChatMessage', 'Response', resp);
      return resp;
    },
  };
}
