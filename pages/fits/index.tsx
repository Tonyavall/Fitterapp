import Layout from "../../components/layouts/article"
import { useAtom } from 'jotai'
import { loggedInAtom } from '../../utils/globalAtoms'
import { useEffect } from "react"
import Router from "next/router"
import Auth from "../../utils/clientAuth"
import {
    Box,
    Heading,
    Divider,
    Grid,
    GridItem,
    Image,
    Button,
    Icon
} from "@chakra-ui/react"
import { AiOutlinePlusSquare } from 'react-icons/ai'
import { FIND_FITS } from "../api/queries"
import { GetServerSideProps } from 'next'
import client, { addClientState } from '../../apollo/client'


const Fits = ({ data }: any) => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)

    const {
        bottoms = [],
        footwear = [],
        tops = []
    } = data.data.findMe

    // TODO!!!!need loading implementation for all componetns

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
                height="fit-content"
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
                        p={['.5em', '1em', '2em']}
                        pb={['.25em', '.25em', '1em']}
                    >
                        <Heading
                            fontWeight="light"
                            fontSize="2rem"
                            textAlign="left"
                        >
                            Tops
                        </Heading>

                        <Box>
                            <Button
                                colorScheme="twitter"
                                size="sm" height={27.5}
                                mr={2.5}
                                onClick={()=> Router.push('/fits/add')}
                            >
                                Add Clothes
                            </Button>
                            <Button
                                colorScheme="twitter"
                                size="sm"
                                height={27.5}
                                onClick={()=> Router.push('/fits/outfits')}
                            >
                                See Outfits
                            </Button>
                        </Box>
                    </Box>
                    <Divider borderColor="gray" />
                    {tops ?
                        <Grid
                            mt={1}
                            templateColumns={`repeat(${5}, 1fr)`}
                            gap={[0, 0, 0, 1, 1]}
                        >
                            {
                                tops.map((top: any) => {
                                    return (
                                        <GridItem
                                            key={top._id}
                                        >
                                            <Image
                                                bg="lightgray"
                                                alt="Picture of a top"
                                                boxSize={[65, 86, 145, 186, 186]}
                                                objectFit="cover"
                                                src={top.image}
                                                data-topid={top._id}
                                            />
                                        </GridItem>
                                    )
                                })
                            }
                        </Grid>
                        :
                        <Heading fontWeight="light" fontSize="2rem" textAlign="center" m="1em">
                            {"You don't have any tops :("}
                        </Heading>
                    }
                </Box>

                <Box w="full">
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        p={['.5em', '1em', '2em']}
                        pb={['.25em', '.25em', '1em']}
                    >
                        <Heading
                            fontWeight="light"
                            fontSize="2rem"
                            textAlign="left"
                        >
                            Bottoms
                        </Heading>
                    </Box>
                    <Divider borderColor="gray" />
                    {bottoms ?
                        <Grid
                            mt={1}
                            templateColumns={`repeat(${5}, 1fr)`}
                            gap={[0, 1]}
                        >
                            {
                                bottoms?.map((bottom: any) => {
                                    return (
                                        <GridItem
                                            key={bottom._id}
                                        >
                                            <Image
                                                bg="lightgray"
                                                alt="Picture of a bottom"
                                                boxSize={[65, 86, 145, 186, 186]}
                                                objectFit="cover"
                                                src={bottom.image}
                                                data-bottomid={bottom._id}
                                            />
                                        </GridItem>
                                    )
                                })
                            }
                        </Grid>
                        :
                        <Heading fontWeight="light" fontSize="2rem" textAlign="center" m="1em">
                            {"You don't have any bottoms:("}
                        </Heading>
                    }
                </Box>

                <Box w="full">
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        p={['.5em', '1em', '2em']}
                        pb={['.25em', '.25em', '1em']}
                    >
                        <Heading
                            fontWeight="light"
                            fontSize="2rem"
                            textAlign="left"
                        >
                            Footwear
                        </Heading>
                    </Box>
                    <Divider borderColor="gray" />
                    {footwear ?
                        <Grid
                            mt={1}
                            templateColumns={`repeat(${5}, 1fr)`}
                            gap={[0, 1]}
                        >
                            {
                                footwear?.map((footwear: any) => {
                                    return (
                                        <GridItem
                                            key={footwear._id}
                                        >
                                            <Image
                                                bg="lightgray"
                                                alt="Picture of footwear"
                                                boxSize={[65, 86, 145, 186, 186]}
                                                objectFit="cover"
                                                src={footwear.image}
                                                data-footwearid={footwear._id}
                                            />
                                        </GridItem>
                                    )
                                })
                            }
                        </Grid>
                        :
                        <Heading fontWeight="light" fontSize="2rem" textAlign="center" m="1em">
                            {"You don't have any footwear:("}
                        </Heading>
                    }
                </Box>
            </Box>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const data = await client.query<any, any>({
            query: FIND_FITS
        })

        return addClientState(client, {
            props: { data },
        })
    } catch (error) {
        return {
            notFound: true,
        }
    }
}

export default Fits