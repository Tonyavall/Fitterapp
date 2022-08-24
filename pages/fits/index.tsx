import Layout from "../../components/layouts/article"
import { useAtom } from 'jotai'
import { loggedInAtom } from '../../utils/globalAtoms'
import { useEffect } from "react"
import Router from "next/router"
import Auth from "../../utils/clientAuth"
import { Box, Heading, Divider, Grid, GridItem, Image } from "@chakra-ui/react"

const Fits = () => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)

    useEffect(() => {
        if (Auth.loggedIn()) {
            return setLoggedIn(true)
        }
        setLoggedIn(false)
        Router.push('/login')
    }, [setLoggedIn])

    return (
        <Layout>
            <Box
                w="full"
                height="100vh"
                display="flex"
                flexDirection="column"
                alignItems="start"
            >
                <Box w="full">
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        p={['.5em', '1em','2em']}
                        pb={['.25em', '.25em','1em']}
                    >
                        <Heading
                            fontWeight="light"
                            fontSize="2rem"
                            textAlign="left"
                        >
                            Tops
                        </Heading>
                    </Box>
                    <Divider borderColor="gray"/>
                    <Grid
                        mt={1}
                        templateColumns={`repeat(${4}, 1fr)`}
                        gap={[0, 1]}
                    >
                        <GridItem
                            key="doahdw"
                        >
                            <Image
                                bg="lightgray"
                                alt="wups"
                                boxSize={[77,86,162,232,232]}
                                objectFit="cover"
                                src="src"
                                data-topid=""
                                cursor="pointer"
                            />
                        </GridItem>
                    </Grid>
                </Box>
            </Box>
        </Layout>
    )
}

export default Fits