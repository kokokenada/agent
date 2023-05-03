export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
}

export interface Chat {
  __typename?: 'Chat';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  messages: Array<ChatMessageType>;
  name: Scalars['String'];
}

export interface ChatMessageType {
  __typename?: 'ChatMessageType';
  chat: Chat;
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
}

export interface CreateChatMessageMutation {
  __typename?: 'CreateChatMessageMutation';
  chatMessage?: Maybe<ChatMessageType>;
}

export interface CreateChatMutation {
  __typename?: 'CreateChatMutation';
  chat?: Maybe<Chat>;
}

export interface Mutation {
  __typename?: 'Mutation';
  createChat?: Maybe<CreateChatMutation>;
  createChatMessage?: Maybe<CreateChatMessageMutation>;
}

export interface MutationcreateChatArgs {
  name?: InputMaybe<Scalars['String']>;
}

export interface MutationcreateChatMessageArgs {
  chatId: Scalars['ID'];
  content: Scalars['String'];
}

export interface Query {
  __typename?: 'Query';
  myChats?: Maybe<Array<Maybe<Chat>>>;
}

export type ChatFragmentFragment = {
  __typename?: 'Chat';
  id: string;
  name: string;
};

export type chatsQueryVariables = Exact<{ [key: string]: never }>;

export type chatsQuery = {
  __typename?: 'Query';
  myChats?: Array<{
    __typename?: 'Chat';
    id: string;
    name: string;
  } | null> | null;
};
