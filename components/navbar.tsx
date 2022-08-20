import React from "react";

import {
    chakra,
    Box,
    Flex,
    useColorModeValue,
    VisuallyHidden,
    HStack,
    Button,
    useDisclosure,
    VStack,
    IconButton,
    CloseButton,
    InputGroup,
    InputLeftElement,
    Input,
    Avatar,
} from "@chakra-ui/react";
import {
    AiOutlineMenu,
    AiFillHome,
    AiOutlineSearch,
    AiFillBell,
} from "react-icons/ai";
import { BsFillCameraVideoFill } from "react-icons/bs";

import Link from "next/link";

const Navbar = () => {
    const bg = useColorModeValue("white", "gray.800");
    const mobileNav = useDisclosure();

    return (
        <React.Fragment>
            <chakra.header
                bg={bg}
                w="full"
                px={{
                    base: 2,
                    sm: 4,
                }}
                py={4}
                shadow="md"
            >
                <Flex alignItems="center" justifyContent="space-between" mx="auto">
                    <HStack display="flex" spacing={3} alignItems="center">
                        <Box
                            display={{
                                base: "inline-flex",
                                md: "none",
                            }}
                        >
                            <IconButton
                                display={{
                                    base: "flex",
                                    md: "none",
                                }}
                                aria-label="Open menu"
                                fontSize="20px"
                                color="gray.800"
                                _dark={{
                                    color: "inherit",
                                }}
                                variant="ghost"
                                icon={<AiOutlineMenu />}
                                onClick={mobileNav.onOpen}
                            />
                        </Box>
                        <chakra.a
                            href="/"
                            title="Choc Home Page"
                            display="flex"
                            alignItems="center"
                        >
                            Fitter
                        </chakra.a>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <AiOutlineSearch />
                            </InputLeftElement>
                            <Input type="tel" placeholder="Search..." />
                        </InputGroup>
                    </HStack>

                    <HStack
                        spacing={3}
                        display={mobileNav.isOpen ? "none" : "flex"}
                        alignItems="center"
                    >
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
                            <Button w="full" variant="ghost" leftIcon={<AiFillHome />}>
                                Messages
                            </Button>
                            <Button
                                w="full"
                                variant="ghost"
                                leftIcon={<BsFillCameraVideoFill />}
                            >
                                Fits
                            </Button>
                        </VStack>
                        <HStack
                            spacing={3}
                            display={{
                                base: "none",
                                md: "inline-flex",
                            }}
                        >
                            <Button variant="ghost" leftIcon={<AiFillHome />} size="sm">
                                Signout
                            </Button>
                            <Button variant="ghost" leftIcon={<AiFillHome />} size="sm">
                                Messages
                            </Button>
                            <Button
                                variant="ghost"
                                leftIcon={<BsFillCameraVideoFill />}
                                size="sm"
                            >
                                Fits
                            </Button>
                        </HStack>

                        <chakra.a
                            p={3}
                            color="gray.800"
                            _dark={{
                                color: "inherit",
                            }}
                            rounded="sm"
                            _hover={{
                                color: "gray.800",
                                _dark: {
                                    color: "gray.600",
                                },
                            }}
                        >
                            <AiFillBell />
                            <VisuallyHidden>Notifications</VisuallyHidden>
                        </chakra.a>

                        <Link href="/tonyavall">
                            <Avatar
                                cursor="pointer"
                                size="sm"
                                name="Dan Abrahmov"
                                src="https://bit.ly/dan-abramov"
                            />
                        </Link>
                    </HStack>
                </Flex>
            </chakra.header>
        </React.Fragment>
    );
}

export default Navbar