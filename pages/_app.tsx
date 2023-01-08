import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import Layout from '../components/layouts/main';
import { Provider as JotaiProvider } from 'jotai';
import { useApollo } from '../apollo/client';
import App from 'next/app';
import { initializeS3, S3Vars } from '../utils/s3'

interface AppPropsWithToken extends AppProps {
  s3Vars: S3Vars
}

function MyApp({ Component, pageProps, s3Vars }: AppPropsWithToken,) {
  const client = useApollo(pageProps.initialApolloState)

  if (s3Vars.accessKeyId && s3Vars.secretAccessKey && s3Vars.region) {
    initializeS3(s3Vars)
  }

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

MyApp.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext);

  const s3Vars = {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
  }

  return { ...appProps, s3Vars }
}

export default MyApp;