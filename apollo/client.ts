import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import cookie from 'next-cookies';
import { useMemo } from 'react';
import merge from 'deepmerge';
import { GetServerSidePropsContext } from 'next';

let apolloClient: any
const local = process.env.NODE_ENV !== "production"

export const createClient = (context: GetServerSidePropsContext | string, isToken = false) => {
    // in the initial apollo provider client we just pass the token itself
    // @ts-ignore
    const token = isToken ? context : cookie(context).token

    const httpLink = createHttpLink({
        uri: local ? 'http://localhost:3000/api/graphql' : 'https://fitterapp.vercel.app/api/graphql'
    });

    const authLink = setContext((req, { headers }) => {

        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            }
        }
    });

    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });
}

export function initializeApollo(context: GetServerSidePropsContext | string, isToken = false, initialState = null) {
    const _apolloClient = apolloClient ?? createClient(context, isToken)

    // Merging existing cache
    if (initialState) {
        const existingCache = _apolloClient.extract()
        const data = merge(initialState, existingCache)
        _apolloClient.cache.restore(data)
    }
    // note- always create a new client for ssr
    if (typeof window === 'undefined') return _apolloClient
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

// typing - initialState = current cache | is initially null
export function useApollo(context: GetServerSidePropsContext | string, isToken = false, initialState = null) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const store = useMemo(() => initializeApollo(context, isToken, initialState), [initialState])
    return store
}

export default initializeApollo