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
  createChatMessageMutation,
} from './types';

export const CHAT_MESSAGE_FIELDS = gql`
  fragment ChatMessageFragment on ChatMessage {
    id
    content
    senderUser {
      id
      name
      isAI
    }
  }
`;

export const CHAT_FIELDS = gql`
  ${CHAT_MESSAGE_FIELDS}
  fragment ChatFragment on Chat {
    id
    name
    lastMessage {
      ...ChatMessageFragment
    }
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

    async createChatMessage(
      id: string,
      chatId: string,
      content: string,
      answerAs?: string | undefined,
    ) {
      DEBUG && ClientLogger.debug('useChatApi.createChat', `started`);
      const resp = await api.mutate<
        createChatMessageMutation,
        MutationcreateChatMessageArgs
      >({
        mutation: gql`
          ${CHAT_MESSAGE_FIELDS}
          mutation createChatMessage(
            $id: ID!
            $chatId: ID!
            $content: String!
            $answerAs: String
          ) {
            createChatMessage(
              id: $id
              chatId: $chatId
              content: $content
              answerAs: $answerAs
            ) {
              chatMessage {
                ...ChatMessageFragment
              }
            }
          }
        `,
        variables: { id, chatId, content, answerAs },
      });
      DEBUG &&
        ClientLogger.debug('useChatApi.createChatMessage', 'Response', resp);
      return resp;
    },
  };
}
