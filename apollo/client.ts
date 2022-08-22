import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { concatPagination } from '@apollo/client/utilities'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

const httpLink = createHttpLink({
    uri: 'http://localhost:3000/api/graphql',
});

const authLink = setContext((_, { headers }) => {
    // let token = (typeof window !== 'undefined') ? localStorage.getItem('id_token') : ''
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoidG9ueUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRvbnlhdmFsbCIsIl9pZCI6IjYzMDA2ZTkxMzM5ZGQ3Y2ZiOWFiNzNkMCIsImlzQWRtaW4iOmZhbHNlfSwiaWF0IjoxNjYxMTg5OTA2LCJleHAiOjE2NjExOTcxMDZ9.ZutYOO6cfDM-gLkkbPDR6nkTjX8D6EATv9wjwUVAAHY'
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    allPosts: concatPagination(),
                },
            },
        },
    }),
});

export function addClientState(client: any, pageProps: any) {
    if (pageProps?.props) {
        pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
    }

    return pageProps
}

export default client