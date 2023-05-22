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
  GenericScalar: any;
  UUID: any;
}

export interface Chat {
  __typename?: 'Chat';
  createdAt: Scalars['DateTime'];
  id: Scalars['UUID'];
  messages: ChatMessageConnection;
  name: Scalars['String'];
}

export interface ChatmessagesArgs {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  chat?: InputMaybe<Scalars['UUID']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}

export interface ChatMessage extends Node {
  __typename?: 'ChatMessage';
  blah?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  /** The ID of the object */
  id: Scalars['ID'];
}

export interface ChatMessageConnection {
  __typename?: 'ChatMessageConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ChatMessageEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
}

/** A Relay edge containing a `ChatMessage` and its cursor. */
export interface ChatMessageEdge {
  __typename?: 'ChatMessageEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ChatMessage>;
}

export interface CreateChatMessageMutation {
  __typename?: 'CreateChatMessageMutation';
  chatMessage?: Maybe<ChatMessage>;
}

export interface CreateChatMutation {
  __typename?: 'CreateChatMutation';
  chat?: Maybe<Chat>;
}

export interface LogoutMutation {
  __typename?: 'LogoutMutation';
  success?: Maybe<Scalars['Boolean']>;
}

export interface Mutation {
  __typename?: 'Mutation';
  createChat?: Maybe<CreateChatMutation>;
  createChatMessage?: Maybe<CreateChatMessageMutation>;
  logout?: Maybe<LogoutMutation>;
  refreshToken?: Maybe<Refresh>;
  /** Obtain JSON Web Token mutation */
  tokenAuth?: Maybe<ObtainJSONWebToken>;
  verifyToken?: Maybe<Verify>;
}

export interface MutationcreateChatArgs {
  name?: InputMaybe<Scalars['String']>;
}

export interface MutationcreateChatMessageArgs {
  chatId: Scalars['ID'];
  content: Scalars['String'];
  id: Scalars['ID'];
}

export interface MutationrefreshTokenArgs {
  refreshToken?: InputMaybe<Scalars['String']>;
}

export interface MutationtokenAuthArgs {
  email: Scalars['String'];
  password: Scalars['String'];
}

export interface MutationverifyTokenArgs {
  token?: InputMaybe<Scalars['String']>;
}

/** An object with an ID */
export interface Node {
  /** The ID of the object */
  id: Scalars['ID'];
}

/** Obtain JSON Web Token mutation */
export interface ObtainJSONWebToken {
  __typename?: 'ObtainJSONWebToken';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  refreshToken: Scalars['String'];
  token: Scalars['String'];
}

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export interface PageInfo {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
}

export interface Query {
  __typename?: 'Query';
  chatMessages?: Maybe<ChatMessageConnection>;
  myChats?: Maybe<Array<Maybe<Chat>>>;
}

export interface QuerychatMessagesArgs {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  chat?: InputMaybe<Scalars['UUID']>;
  chatId: Scalars['ID'];
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}

export interface Refresh {
  __typename?: 'Refresh';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  refreshToken: Scalars['String'];
  token: Scalars['String'];
}

export interface Verify {
  __typename?: 'Verify';
  payload: Scalars['GenericScalar'];
}

export type logoutMutationVariables = Exact<{ [key: string]: never }>;

export type logoutMutation = {
  __typename?: 'Mutation';
  logout?: { __typename?: 'LogoutMutation'; success?: boolean | null } | null;
};

export type tokenAuthMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;

export type tokenAuthMutation = {
  __typename?: 'Mutation';
  tokenAuth?: { __typename?: 'ObtainJSONWebToken'; token: string } | null;
};

export type ChatFragmentFragment = {
  __typename?: 'Chat';
  id: any;
  name: string;
};

export type ChatMessageFragmentFragment = {
  __typename?: 'ChatMessage';
  id: string;
  content: string;
};

export type myChatsQueryVariables = Exact<{ [key: string]: never }>;

export type myChatsQuery = {
  __typename?: 'Query';
  myChats?: Array<{ __typename?: 'Chat'; id: any; name: string } | null> | null;
};

export type chatMessagesQueryVariables = Exact<{
  chatId: Scalars['ID'];
}>;

export type chatMessagesQuery = {
  __typename?: 'Query';
  chatMessages?: {
    __typename?: 'ChatMessageConnection';
    edges: Array<{
      __typename?: 'ChatMessageEdge';
      node?: { __typename?: 'ChatMessage'; id: string; content: string } | null;
    } | null>;
  } | null;
};

export type createChatMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type createChatMutation = {
  __typename?: 'Mutation';
  createChat?: {
    __typename?: 'CreateChatMutation';
    chat?: { __typename?: 'Chat'; id: any; name: string } | null;
  } | null;
};

export type createChatMessageMutationVariables = Exact<{
  id: Scalars['ID'];
  chatId: Scalars['ID'];
  content: Scalars['String'];
}>;

export type createChatMessageMutation = {
  __typename?: 'Mutation';
  createChatMessage?: {
    __typename?: 'CreateChatMessageMutation';
    chatMessage?: {
      __typename?: 'ChatMessage';
      id: string;
      content: string;
    } | null;
  } | null;
};
