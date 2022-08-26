import { useAtom } from "jotai"
import { loggedInAtom } from "../../../utils/globalAtoms"
import { useEffect } from "react"
import Router from "next/router"
import Auth from "../../../utils/clientAuth"
import Layout from "../../../components/layouts/article"
import {
    Box,
    Heading,
    Button,
    Grid,
    Divider,
} from "@chakra-ui/react"
import { FIND_FITS } from "../../api/queries"
import OutfitCarousel from "../../../components/outfitCarousel"
import { useQuery } from "@apollo/client"

const Outfits = () => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)
    const { data, loading } = useQuery(FIND_FITS);

    useEffect(() => {
        if (Auth.loggedIn()) {
            return setLoggedIn(true)
        }
        setLoggedIn(false)
        Router.push('/login')
    }, [setLoggedIn])

    const {
        outfits = []
    } = data?.findMe || {}

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
                            Outfits
                        </Heading>

                        <Box>
                            <Button
                                colorScheme="twitter"
                                size="sm" height={27.5}
                                mr={2.5}
                                onClick={() => Router.push('/fits')}
                            >
                                {'<'} Back
                            </Button>
                            <Button
                                colorScheme="twitter"
                                size="sm"
                                height={27.5}
                                onClick={() => Router.push('/fits/post')}
                            >
                                Post Outfit
                            </Button>
                        </Box>
                    </Box>
                    <Divider borderColor="gray" mb={4} />
                    {outfits ?
                        <Grid
                            mt={1}
                            templateColumns="repeat(3, 1fr)"
                            gap={[0, 0, 2, 6, 6]}
                        >
                            {
                                outfits.map((outfit: any) => {
                                    return (
                                        <OutfitCarousel
                                            key={outfit._id}
                                            _id={outfit._id}
                                            tops={outfit.top}
                                            bottoms={outfit.bottom}
                                            footwear={outfit.footwear}
                                        />
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

            </Box>
        </Layout>
    )
}

export default Outfits