import React, { useEffect } from "react";
import Router from "next/router";
import {
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Center,
    chakra,
    Box,
    Flex,
    useColorModeValue,
    HStack,
    useDisclosure,
    VStack,
    IconButton,
    CloseButton,
    InputGroup,
    InputLeftElement,
    Input,
    Tooltip
} from "@chakra-ui/react";
import {
    AiOutlineMenu,
    AiOutlineInbox,
    AiOutlineSearch,
    AiOutlineHome,
} from "react-icons/ai";
import { TbShirt } from "react-icons/tb"
import { LOGOUT } from '../pages/api/mutations'
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { FIND_ME } from "../pages/api/queries";
import { userProfileAtom } from "../lib/globalAtoms";
import { useAtom } from "jotai";
// https://choc-ui.com/docs/packages/autocomplete\
// https://stackoverflow.com/questions/65460085/open-a-page-in-a-next-js-website-as-an-overlay
// SEARCH OPTIONS UP TOP

const Navbar = () => {
    const bg = useColorModeValue("white", "gray.800");
    const mobileNav = useDisclosure();
    const client = useApolloClient()
    const [logout] = useMutation(LOGOUT)
    const { data: userProfileData } = useQuery(FIND_ME)
    const [userProfile, setUserProfile] = useAtom(userProfileAtom)

    useEffect(() => {
        setUserProfile(userProfileData?.findMe)
    }, [userProfileData, setUserProfile])

    // search bar stuff here
    // const { loading, error, data } = useQuery(FIND_ALL_USERS)

    const handleLogout = async () => {
        await logout()
        await client.resetStore()
        setUserProfile(null)
        Router.push('/login')
    }

    return (
        <chakra.header
            bg={bg}
            px={{ base: 2, sm: 4 }}
            py={4}
            shadow="md"
            width="100vw"
            maxW="100%"
            hidden={!(!!userProfile)}
        >
            <Flex alignItems="center" justifyContent="space-between" mx="auto" maxW={955} height="27.5px">
                <HStack display="flex" spacing={3} alignItems="center">
                    <Box width="4em" fontSize="1.6rem" fontWeight="medium" fontFamily="cursive" letterSpacing="1.5px">
                        Fitter
                    </Box>
                    <Box display={{ base: "inline-flex", md: "none" }}>
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            aria-label="Open menu"
                            fontSize="20px"
                            color="gray.800"
                            _dark={{ color: "inherit" }}
                            variant="ghost"
                            icon={<AiOutlineMenu />}
                            onClick={mobileNav.onOpen}
                        />
                        {/* Vertical menu for mobile */}
                        <VStack
                            pos="absolute"
                            top={0}
                            left={0}
                            right={0}
                            display={mobileNav.isOpen ? "flex" : "none"}
                            flexDirection="column"
                            p={2}
                            pb={4}
                            m={2}
                            bg={bg}
                            spacing={3}
                            rounded="sm"
                            shadow="sm"
                            zIndex={100}
                        >
                            <CloseButton
                                aria-label="Close menu"
                                justifySelf="self-start"
                                onClick={mobileNav.onClose}
                            />
                            <Button
                                w="full"
                                variant="ghost"
                                leftIcon={<AiOutlineHome />}
                                onClick={() => Router.push('/')}
                            >
                                Home
                            </Button>
                            <Button
                                w="full"
                                variant="ghost"
                                colorScheme="brand"
                                leftIcon={<AiOutlineInbox />}
                                onClick={() => Router.push('/direct')}
                            >
                                Inbox
                            </Button>
                            <Button
                                w="full"
                                variant="ghost"
                                leftIcon={<TbShirt />}
                                onClick={() => Router.push('/fits')}
                            >
                                Fits
                            </Button>
                        </VStack>
                    </Box>
                </HStack>
                <InputGroup width={[150, 275]} display={mobileNav.isOpen ? "none" : "flex"}>
                    <InputLeftElement pointerEvents="none" height="2em">
                        <AiOutlineSearch />
                    </InputLeftElement>
                    <Input type="tel" placeholder="Search" bg="#EFEFEF" height="2em" />
                </InputGroup>
                <HStack
                    spacing={3}
                    display={mobileNav.isOpen ? "none" : "flex"}
                >
                    {/* Horizontal menu */}
                    <HStack spacing={6} display={{ base: "none", md: "inline-flex" }} mr="1em">
                        <Tooltip hasArrow label='Home' bg='gray.300' color='black'>
                            <button onClick={() => Router.push('/')}>
                                <AiOutlineHome cursor="pointer" size={25} />
                            </button>
                        </Tooltip>
                        <Tooltip hasArrow label='Messages' bg='gray.300' color='black'>
                            <button onClick={() => Router.push('/direct')}>
                                <AiOutlineInbox cursor="pointer" size={25} />
                            </button>
                        </Tooltip>
                        <Tooltip hasArrow label='My Fits' bg='gray.300' color='black'>
                            <button onClick={() => Router.push('/fits')}>
                                <TbShirt cursor="pointer" size={25} />
                            </button>
                        </Tooltip>
                    </HStack>
                    {/* Profile avatar menu */}
                    <Menu placement="bottom-end">
                        <MenuButton
                            as={Button}
                            rounded={'full'}
                            variant={'link'}
                            cursor={'pointer'}
                            minW={0}>
                            <Avatar
                                size={'sm'}
                                objectFit="scale-down"
                                src={userProfile?.userImage}
                            />
                        </MenuButton>
                        <MenuList alignItems={'center'} zIndex={3}>
                            <br />
                            <Center>
                                <Avatar
                                    size={'2xl'}
                                    objectFit="scale-down"
                                    src={userProfile?.userImage}
                                />
                            </Center>
                            <br />
                            <Center>
                                <p>{userProfile?.username}</p>
                            </Center>
                            <br />
                            <MenuDivider />
                            <MenuItem as="button" onClick={() => Router.push(`/${userProfile?.username}`)}>Profile</MenuItem>
                            <MenuItem as="button" onClick={() => Router.push('/settings')}>Account Settings</MenuItem>
                            <MenuItem as="button" onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>
        </chakra.header>
    );
}

export default Navbar