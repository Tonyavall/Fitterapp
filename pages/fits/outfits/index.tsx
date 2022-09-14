import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import Router from "next/router"
import Layout from "../../../components/layouts/article"
import {
    Box,
    Heading,
    Button,
    Grid,
    Divider,
    useRadioGroup,
    Spinner
} from "@chakra-ui/react"
import OutfitCarousel from "../../../components/imageCarousel"
import { useQuery } from "@apollo/client"
import PostOutfitModal from "../../../components/postOutfitModal"
import { GetServerSideProps } from "next"
import initializeApollo from '../../../apollo/client'
import { IS_LOGGED_IN, FIND_FITS } from "../../api/queries"

interface outfitObject {
    top: {
        _id?: string
        image?: string
    }
    bottom: {
        _id?: string
        image?: string
    }
    footwear?: {
        _id?: string
        image?: string
    }
    _id: string
}

const Outfits = () => {
    const { data, loading } = useQuery(FIND_FITS);
    const [selectedOutfit, setSelectedOutfit] = useState<outfitObject | null>(null)

    const {
        outfits = []
    } = data?.findFits || {}

    const handleOutfitChange = (value: any) => {
        const currentOutfit = JSON.parse(value)
        setSelectedOutfit(currentOutfit)
    }

    const { getRadioProps, getRootProps } = useRadioGroup({
        defaultValue: '',
        onChange: handleOutfitChange
    })

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
                            <PostOutfitModal
                                outfitId={selectedOutfit?._id}
                                topImage={selectedOutfit?.top.image}
                                bottomImage={selectedOutfit?.bottom.image}
                                footwearImage={selectedOutfit?.footwear?.image}
                            />
                        </Box>
                    </Box>
                    <Divider
                        borderColor="gray"
                        mb={4}
                    />
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
                        : outfits.length ?
                            <Grid
                                mt={1}
                                templateColumns="repeat(3, 1fr)"
                                gap={[0, 0, 2, 6, 6]}
                                {...getRootProps()}
                            >
                                {
                                    outfits.map((outfit: any) => {
                                        return (
                                            <OutfitCarousel
                                                key={outfit?._id}
                                                _id={outfit?._id}
                                                topImage={outfit?.top.image}
                                                bottomImage={outfit?.bottom.image}
                                                footwearImage={outfit?.footwear?.image}
                                                {...getRadioProps({ value: JSON.stringify(outfit) })}
                                            />
                                        )
                                    })
                                }

                            </Grid>
                            :
                            <Heading fontWeight="light" color="gray.500" fontSize="1.1rem" textAlign="center" m="1em">
                                {"You don't have any outfits :("}
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
        await client.query({
            query: IS_LOGGED_IN,
        })

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

export default Outfits