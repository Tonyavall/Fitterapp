import React, { useEffect } from 'react';
import Layout from '../../../components/layouts/article'
import { loggedInAtom } from '../../../utils/globalAtoms'
import { useAtom } from 'jotai'
import Router from 'next/router';
import Auth from '../../../utils/clientAuth'
import { Avatar, Box, Image, Text, Icon, Input, FormControl, Button  } from '@chakra-ui/react';
import { AiOutlineHeart } from 'react-icons/ai'
import { BsChat } from 'react-icons/bs'
import { IoPaperPlaneOutline } from 'react-icons/io5'

const Post = () => {
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
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                w="full"
                h="450px"
                mt="1.4em"
                flexWrap="wrap"
            >
                <Image
                    src=""
                    alt="dnaiwdhjoa"
                    w="600px"
                    h="full"
                />

                {/* ENTIRE COMMENT SECTION CONTAINER */}
                <Box
                    h="full"
                    w="340px"
                    justifyContent="start"
                    alignItems="center"
                    flexDirection="column"
                    border="1px solid lightgray"
                >
                    <Box
                        h="60px"
                        w="full"
                        display="flex"
                        flexDirection="row"
                        justifyContent="start"
                        alignItems="center"
                        borderBottom="1px solid #EFEFEF"
                    >
                        <Avatar
                            size="sm"
                            m="1.25em"
                        />

                        <Text
                            fontWeight="medium"
                            fontSize="sm"
                        >
                            tonyavall
                        </Text>
                    </Box>

                    {/* COMMENTS HERE */}
                    <Box
                        h="245px"
                        w="full"
                        overflowY="auto"
                        display="flex"
                        flexDirection="column"
                        justifyContent="start"
                        alignItems="start"
                        border=".005px lightgray"
                        css={{
                            '::-webkit-scrollbar': {
                                width: '2px',
                            },
                            '::-webkit-scrollbar-thumb': {
                                background: 'lightgray',
                                height: '10px',
                            }
                        }}
                    >
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                        >
                            <Avatar
                                size="sm"
                                m="1.25em"
                                alignSelf="start"
                            />
                            <Text
                                fontWeight="normal"
                                fontSize="sm"
                            >
                                <Text
                                    as="span"
                                    mr=".3em"
                                    fontWeight="medium"
                                >
                                    tonyavall
                                </Text>

                                COMMENT BODY HERE!
                            </Text>
                        </Box>
                    </Box>

                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="start"
                        w="full"
                        alignItems="center"
                        h="50px"
                        borderY="1px solid #EFEFEF"
                    >
                        <Icon as={AiOutlineHeart} h={7} w={7} ml="1em" mr={4}/>
                        <Icon as={BsChat} h="22px" w="22px" strokeWidth=".5px" mr={4}/>
                        <Icon as={IoPaperPlaneOutline} h={6} w={6}/>
                    </Box>

                    <Text
                        ml="1.25em"
                        mt={1}
                        fontSize="sm"
                    >
                        Liked by <Text as="span" fontWeight="bold">logic</Text> here.
                    </Text>
                    <Text
                        ml="1.6em"
                        mt={1}
                        fontSize=".7em"
                        fontWeight="light"
                    >
                        Aug 23, 2022
                    </Text>

                    <FormControl 
                        flexDirection="row"
                        flexWrap="nowrap"
                        alignItems="center"
                        ml="1.15em"
                        mt="6px"
                    >
                        <Input placeholder='Add a comment' fontSize="sm" w="250px" h="35px" border="none"/>
                        {/* @ts-ignore */}
                        <Button h="35px" border="none" bg="white" _hover="" fontSize="sm" color="twitter.600" fontWeight="bold" ml="1px">Post</Button>
                    </FormControl>
                </Box>
            </Box>
        </Layout>
    )
}

export default Post