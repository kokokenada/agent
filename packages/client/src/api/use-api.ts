import {
  ApolloQueryResult,
  OperationVariables,
  QueryOptions,
  MutationOptions,
  FetchResult,
  NetworkStatus,
  useMutation,
  useQuery,
  gql,
} from '@apollo/client';
import {
  MutationHookOptions,
  MutationTuple,
  QueryHookOptions,
  QueryResult,
} from '@apollo/client/react/types/types';
import { DocumentNode } from 'graphql';

import { getApolloClient, logout } from './apollo-client';
import { UserContext } from '../auth/user-context';
import { useContext } from 'react';

export function useApi() {
  const userContext = useContext(UserContext);

  return {
    query<
      T = any,
      TVariables extends OperationVariables | undefined = OperationVariables,
    >(options: QueryOptions<TVariables>): Promise<ApolloQueryResult<T>> {
      return getApolloClient().query({
        errorPolicy: 'all',
        context: userContext,
        ...options,
      });
    },

    mutate<
      TData extends any = any,
      TVariables extends OperationVariables = OperationVariables,
    >(
      options: MutationOptions<TData, TVariables>,
    ): Promise<FetchResult<TData>> {
      return getApolloClient().mutate({
        errorPolicy: 'all',
        context: userContext,
        ...options,
      });
    },

    useMutation<T = any, TVariables = OperationVariables>(
      mutation: DocumentNode,
      options?: MutationHookOptions<T, TVariables>,
    ): MutationTuple<T, TVariables> {
      return useMutation(mutation, {
        client: getApolloClient(),
        context: userContext,
        ...options,
      });
    },

    useQuery<
      TData = any,
      TVariables extends OperationVariables = OperationVariables,
    >(
      query: DocumentNode,
      options: QueryHookOptions<TData, TVariables> | undefined,
    ): QueryResult<TData, TVariables> {
      return useQuery(query, {
        client: getApolloClient(),
        context: userContext,
        ...options,
      });
    },
    userContext,
    logout: () => {
      logout();
    },
  };
}
