import Layout from "../../components/layouts/article"
import { useEffect, useState } from "react"
import Router from "next/router"
import {
    Box,
    Heading,
    Divider,
    Grid,
    Button,
    Spinner
} from "@chakra-ui/react"
import { FIND_FITS } from "../api/queries"
import AddClothesModal from "../../components/AddClothesModal"
import { useToast } from "@chakra-ui/react"
import { useMutation, useQuery } from "@apollo/client"
import { ADD_OUTFIT } from "../api/mutations"
import FitsRadioGroup from "../../components/FitsRadioGroups"
import { checkProps } from "../../utils/functions"
import { GetServerSideProps } from "next"
import initializeApollo from '../../apollo/client'
import { IS_LOGGED_IN } from "../api/queries"

const Fits = () => {
    const [selectedFits, setSelectedFits] = useState({ top: null, bottom: null, footwear: null })
    const toast = useToast()
    const { data, loading } = useQuery(FIND_FITS);

    const {
        bottoms = [],
        footwear = [],
        tops = []
    } = data?.findFits || {}

    const [
        addOutfit,
        { data: addOutfitData, error: addOutfitError }
    ] = useMutation(ADD_OUTFIT, {
        update(cache, { data: { addOutfit: { outfits } } }) {
            //retrieve cached query value from memory
            const { findFits }: any = cache.readQuery({
                query: FIND_FITS
            })
            cache.writeQuery({
                query: FIND_FITS,
                data: {
                    findFits: {
                        ...findFits,
                        outfits: outfits,
                    }
                }
            })
        }
    })

    useEffect(() => {
        if (addOutfitData) {
            toast({
                title: "Outfit has been added.",
                status: 'success',
                duration: 5000,
            })
        }
        if (addOutfitError) {
            toast({
                title: "An error occured.",
                status: 'error',
                duration: 1500,
            })
        }
    }, [addOutfitData, addOutfitError, toast])

    const handleOutfitAddition = async () => {
        try {
            const { check, property = null } = checkProps(selectedFits, 'footwear')

            if (!check) {
                toast({
                    title: `Please select a ${property}`,
                    status: 'error',
                    duration: 1500,
                })
                return
            }
            addOutfit({ variables: selectedFits })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <Box
                w="full"
                height="fit-content"
                display="flex"
                flexDirection="column"
                alignItems="start"
            >
                <Box
                    w="full"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box
                        w="full"
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        p={['.5em', '1em', '2em']}
                        pb={['.25em', '.25em', '1em']}
                    >
                        <Heading
                            fontWeight="normal"
                            fontSize={["1.25rem", "1.5rem"]}
                            textAlign="left"
                        >
                            tops
                        </Heading>

                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            flexWrap="wrap"
                            w={["150px", "325px"]}
                        >
                            <AddClothesModal />
                            <Button
                                colorScheme="twitter"
                                size="sm"
                                height={27.5}
                                mr={2.5}
                                onClick={handleOutfitAddition}
                                mb={1}
                            >
                                Create Outfit
                            </Button>

                            <Button
                                colorScheme="twitter"
                                size="sm"
                                height={27.5}
                                onClick={() => Router.push('/fits/outfits')}
                                mb={1}
                            >
                                See Outfits
                            </Button>
                        </Box>
                    </Box>
                    <Divider borderColor="gray" />
                    {loading ?
                        <Spinner
                            justifySelf="center"
                            thickness='2px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='md'
                            mt={10}
                        />
                        : tops.length ?
                            <Grid
                                mt={1}
                                templateColumns={`repeat(${5}, 1fr)`}
                                gap={[0, 1]}
                            >
                                <FitsRadioGroup
                                    fits={tops}
                                    setSelectedFits={setSelectedFits}
                                    selectedFits={selectedFits}
                                />
                            </Grid>
                            :
                            <Heading fontWeight="light" color="gray.500" fontSize="1.1rem" textAlign="center" m="1em">
                                {"You don't have any tops :("}
                            </Heading>
                    }
                </Box>

                <Box
                    w="full"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        p={['.5em', '1em', '2em']}
                        pb={['.25em', '.25em', '1em']}
                        w="full"
                    >
                        <Heading
                            fontWeight="normal"
                            fontSize={["1.25rem", "1.5rem"]}
                            textAlign="left"
                            w="full"
                        >
                            bottoms
                        </Heading>
                    </Box>
                    <Divider borderColor="gray" />
                    {loading ?
                        <Spinner
                            justifySelf="center"
                            thickness='2px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='md'
                            mt={10}
                        />
                        : bottoms.length ?
                            <Grid
                                mt={1}
                                templateColumns={`repeat(${5}, 1fr)`}
                                gap={[0, 1]}
                            >
                                <FitsRadioGroup
                                    fits={bottoms}
                                    setSelectedFits={setSelectedFits}
                                    selectedFits={selectedFits}
                                />
                            </Grid>
                            :
                            <Heading fontWeight="light" color="gray.500" fontSize="1.1rem" textAlign="center" m="1em">
                                {"You don't have any bottoms :("}
                            </Heading>
                    }
                </Box>

                <Box
                    w="full"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        p={['.5em', '1em', '2em']}
                        pb={['.25em', '.25em', '1em']}
                        w="full"
                    >
                        <Heading
                            fontWeight="normal"
                            fontSize={["1.25rem", "1.5rem"]}
                            textAlign="left"
                            w="full"
                        >
                            footwear
                        </Heading>
                    </Box>
                    <Divider borderColor="gray" />
                    {loading ?
                        <Spinner
                            justifySelf="center"
                            thickness='2px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='md'
                            mt={10}
                        />
                        : footwear.length ?
                            <Grid
                                mt={1}
                                templateColumns={`repeat(${5}, 1fr)`}
                                gap={[0, 1]}
                            >
                                <FitsRadioGroup
                                    fits={footwear}
                                    setSelectedFits={setSelectedFits}
                                    selectedFits={selectedFits}
                                />
                            </Grid>
                            :
                            <Heading fontWeight="light" color="gray.500" fontSize="1.1rem" textAlign="center" m="1em">
                                {"You don't have any footwear :("}
                            </Heading>
                    }
                </Box>
            </Box>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const client = initializeApollo(context)

    try {
        // A query is sent and cached into apollo client
        await client.query({
            query: IS_LOGGED_IN,
        })

        // We return and change initialApolloState that is initially null to the current client cache that INCLUDES the query above
        return {
            props: {
                initialApolloState: client.cache.extract()
            }
        }
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: true
            }
        }
    }
}

export default Fits