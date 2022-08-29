import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import client from '../apollo/client';
import { ApolloProvider } from '@apollo/client';
import Layout from '../components/layouts/main';
import { Provider as JotaiProvider } from 'jotai';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ApolloProvider client={client}>
      <JotaiProvider>
        <ChakraProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </JotaiProvider>
    </ApolloProvider>
  );
}

export default MyApp;