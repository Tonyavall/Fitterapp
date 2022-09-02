import Navbar from '../navbar'
import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react';
// import {GET_USER} from '../queries'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '../../lib/globalAtoms'

const Main = ({ children }: React.PropsWithChildren) => {

    return (
        <Box>
            <Head>
                <title>Fitter</title>
                <meta name="Fitter" content="Post your fits!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box as="main"
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <Navbar />
                {children}
            </Box>
        </Box>
    )
}

export default Main