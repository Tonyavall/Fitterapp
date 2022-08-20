import React from "react";
import Link from "next/link"
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
    VisuallyHidden,
    HStack,
    useDisclosure,
    VStack,
    IconButton,
    CloseButton,
    InputGroup,
    InputLeftElement,
    Input,
} from "@chakra-ui/react";

import {
    AiOutlineMenu,
    AiFillHome,
    AiOutlineInbox,
    AiOutlineSearch,
    AiFillBell,
    AiOutlineHome,
} from "react-icons/ai";
import { TbShirt } from "react-icons/tb"
const Navbar = () => {
    const bg = useColorModeValue("white", "gray.800");
    const mobileNav = useDisclosure();

    return (
        <chakra.header
            bg={bg}
            w="full"
            px={{ base: 2, sm: 4 }}
            py={4}
            shadow="md"
        >
            <Flex alignItems="center" justifyContent="space-between" mx="auto">
                <HStack display="flex" spacing={3} alignItems="center">
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
                        >
                            <CloseButton
                                aria-label="Close menu"
                                justifySelf="self-start"
                                onClick={mobileNav.onClose}
                            />
                            <Button w="full" variant="ghost" leftIcon={<AiOutlineHome />}>
                                Home
                            </Button>
                            <Button
                                w="full"
                                variant="ghost"
                                colorScheme="brand"
                                leftIcon={<AiOutlineInbox />}
                            >
                                Inbox
                            </Button>
                            <Button
                                w="full"
                                variant="ghost"
                                leftIcon={<TbShirt />}
                            >
                                Fits
                            </Button>
                        </VStack>
                    </Box>

                    {/* Horizontal menu */}
                    <HStack spacing={8} display={{ base: "none", md: "inline-flex" }}>
                        <Link href="/">

                            <AiOutlineHome cursor="pointer" size={25} />
                        </Link>
                        <Link href="/direct">
                            <AiOutlineInbox cursor="pointer" size={25} />
                        </Link>
                        <Link href="/fits">
                            <TbShirt cursor="pointer" size={25} />
                        </Link>
                    </HStack>
                </HStack>
                <HStack
                    spacing={3}
                    display={mobileNav.isOpen ? "none" : "flex"}
                >
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <AiOutlineSearch />
                        </InputLeftElement>
                        <Input type="tel" placeholder="Search..." />
                    </InputGroup>

                    <chakra.a
                        p={3}
                        color="gray.800"
                        _dark={{ color: "inherit" }}
                        rounded="sm"
                        _hover={{ color: "gray.800", _dark: { color: "gray.600" } }}
                    >
                        <AiFillBell />
                        <VisuallyHidden>Notifications</VisuallyHidden>
                    </chakra.a>

                    {/* Profile avatar menu */}
                    <Menu>
                        <MenuButton
                            as={Button}
                            rounded={'full'}
                            variant={'link'}
                            cursor={'pointer'}
                            minW={0}>
                            <Avatar
                                size={'sm'}
                            />
                        </MenuButton>
                        <MenuList alignItems={'center'}>
                            <br />
                            <Center>
                                <Avatar
                                    size={'2xl'}
                                />
                            </Center>
                            <br />
                            <Center>
                                <p>Username</p>
                            </Center>
                            <br />
                            <MenuDivider />
                            <MenuItem>Your Fits</MenuItem>
                            <MenuItem>Account Settings</MenuItem>
                            <MenuItem>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>
        </chakra.header>
    );
}

export default Navbar