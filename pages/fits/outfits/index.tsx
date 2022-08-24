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
    GridItem,
    Image,
    Divider,
    IconButton,
    useBreakpointValue,
    Stack,
    Text,
    Container,
} from "@chakra-ui/react"
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { FIND_OUTFITS } from "../../api/queries"
import { GetServerSideProps } from 'next'
import client, { addClientState } from '../../../apollo/client'
import { useState } from "react"
// @ts-ignore
import Slider from 'react-slick'

const settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const Outfits = ({ data }: any) => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)

    useEffect(() => {
        if (Auth.loggedIn()) {
            return setLoggedIn(true)
        }
        setLoggedIn(false)
        Router.push('/login')
    }, [setLoggedIn])

    const {
        outfits = []
    } = data.data.findMe

    const [slider, setSlider] = useState<Slider | null>(null);
    const top = useBreakpointValue({ base: '90%', md: '50%' });
    const side = useBreakpointValue({ base: '30%', md: '40px' });

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
                            Fits
                        </Heading>

                        <Box>
                            <Button
                                colorScheme="twitter"
                                size="sm" height={27.5}
                                mr={2.5}
                                onClick={()=> Router.push('/fits/create')}
                            >
                                Create Outfit
                            </Button>
                            <Button
                                colorScheme="twitter"
                                size="sm"
                                height={27.5}
                                onClick={()=> Router.push('/fits/post')}
                            >
                                Post Outfit
                            </Button>
                        </Box>
                    </Box>
                    <Divider borderColor="gray" mb={4}/>
                    {outfits ?
                        <Grid
                            mt={1}
                            templateColumns="repeat(3, 1fr)"
                            gap={[0, 0, 2, 6, 6]}
                        >
                            {
                                outfits.map((outfit: any) => {
                                    return (
                                        <GridItem
                                            key={outfit._id}
                                        >
                                            {/* NEED TO DO OUTFITS HERE FIND IMAGE CAROUSEL */}
                                            <Box
                                                boxSize={[105, 125, 206, 300, 300]}
                                                cursor="pointer"
                                                overflow={'hidden'}
                                                position="relative"
                                            >
                                                <link
                                                    rel="stylesheet"
                                                    type="text/css"
                                                    charSet="UTF-8"
                                                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
                                                />
                                                <link
                                                    rel="stylesheet"
                                                    type="text/css"
                                                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
                                                />
                                                {/* Left Icon */}
                                                <IconButton
                                                    aria-label="left-arrow"
                                                    variant="ghost"
                                                    position="absolute"
                                                    left={side}
                                                    top={top}
                                                    transform={'translate(-75%, -50%)'}
                                                    zIndex={2}
                                                    onClick={() => slider?.slickPrev()}
                                                    size="sm"
                                                >
                                                    <BiLeftArrowAlt size="20px" />
                                                </IconButton>
                                                {/* Right Icon */}
                                                <IconButton
                                                    aria-label="right-arrow"
                                                    variant="ghost"
                                                    position="absolute"
                                                    right={side}
                                                    top={top}
                                                    transform={'translate(75%, -50%)'}
                                                    zIndex={2}
                                                    onClick={() => slider?.slickNext()}
                                                    size="sm"
                                                >
                                                    <BiRightArrowAlt size="20px" />
                                                </IconButton>
                                                {/* Slider */}
                                                <Slider {...settings} ref={(slider: any) => setSlider(slider)}>

                                                    <Image
                                                        position="relative"
                                                        alt="Picture of top"
                                                        objectFit="cover"
                                                        src={outfit.top.image}
                                                    />
                                                    <Image
                                                        position="relative"
                                                        alt="Picture of bottom"
                                                        objectFit="cover"
                                                        src={outfit.bottom.image}
                                                    />
                                                    <Image
                                                        position="relative"
                                                        alt="Picture of footwear"
                                                        objectFit="cover"
                                                        src={outfit.footwear.image}
                                                    />

                                                </Slider>
                                            </Box>
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

            </Box>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const data = await client.query<any, any>({
            query: FIND_OUTFITS
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

export default Outfits