import Navbar from '../navbar'
import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import { useAtom } from 'jotai'
import { loggedInAtom } from '../../utils/globalAtoms'
const Main = ({ children }: React.PropsWithChildren) => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)

    return (
        <Box>
            <Head>
                <title>Fitter</title>
                <meta name="Fitter" content="Post your fits!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {loggedIn ?
                    <Navbar /> : null
                }
                {children}
            </main>
        </Box>
    )
}

export default Main