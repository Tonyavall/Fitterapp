import Layout from "../../components/layouts/article"
import { useAtom } from 'jotai'
import { loggedInAtom } from '../../utils/globalAtoms'
import { useEffect, useState } from "react"
import Router from "next/router"
import Auth from "../../utils/clientAuth"
import {
    Box,
    Heading,
    Divider,
    Grid,
    Button,
} from "@chakra-ui/react"
import { FIND_FITS } from "../api/queries"
import { GetServerSideProps } from 'next'
import client from '../../apollo/client'
import AddClothesModal from "../../components/addClothesModal"
import { useToast } from "@chakra-ui/react"
import { useMutation, useQuery } from "@apollo/client"
import { ADD_OUTFIT } from "../api/mutations"
import FitsRadioGroup from "../../components/fitsRadioGroups"
import { checkProps } from "../../utils/functions"

const Fits = () => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)
    const [selectedFits, setSelectedFits] = useState({ top: null, bottom: null, footwear: null })
    const toast = useToast()
    const { data, loading } = useQuery(FIND_FITS);
    // console.log(data)
    const {
        bottoms = [],
        footwear = [],
        tops = []
    } = data?.findMe || {}

    // TODO!!!! need loading implementation for all componetns

    useEffect(() => {
        if (Auth.loggedIn()) {
            return setLoggedIn(true)
        }
        setLoggedIn(false)
        Router.push('/login')
    }, [setLoggedIn])


    const [addOutfit, { data: addOutfitData, error: addOutfitError }] = useMutation(ADD_OUTFIT)

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
                            fontSize={["1.5rem", "2rem"]}
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
                    {tops.length ?
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
                        <Heading fontWeight="light" color="gray.500" fontSize="1.5rem" textAlign="center" m="1em">
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
                            fontSize={["1.5rem", "2rem"]}
                            textAlign="left"
                        >
                            bottoms
                        </Heading>
                    </Box>
                    <Divider borderColor="gray" />
                    {bottoms.length ?
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
                        <Heading fontWeight="light" color="gray.500" fontSize="1.5rem" textAlign="center" m="1em">
                            {"You don't have any bottoms :("}
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
                            fontSize={["1.5rem", "2rem"]}
                            textAlign="left"
                        >
                            footwear
                        </Heading>
                    </Box>
                    <Divider borderColor="gray" />
                    {footwear.length ?
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
                        <Heading fontWeight="light" color="gray.500" fontSize="1.5rem" textAlign="center" m="1em">
                            {"You don't have any footwear :("}
                        </Heading>
                    }
                </Box>
            </Box>
        </Layout>
    )
}

// export const getServerSideProps: GetServerSideProps = async () => {
//     try {
//         const data = await client.query<any, any>({
//             query: FIND_FITS
//         })
//         // Caching our props/ adding it to the current clients state's props
//         console.log(client.cache.extract())
//         return {
//             props: { data }
//         }
//     } catch (error) {
//         return {
//             notFound: true,
//         }
//     }
// }

export default Fits