import Layout from "../../components/layouts/article"
import {
    GridItem,
    Box,
    SimpleGrid,
    Heading,
    Text,
    chakra,
    Stack,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftAddon,
    Input,
    Textarea,
    FormHelperText,
    Avatar,
    Icon,
    Button,
    Flex,
    VisuallyHidden,
    Select,
    useToast
} from "@chakra-ui/react"
import UserSettingsModal from "../../components/userSettingsModa"
import { FIND_ME } from "../api/queries"
import { useQuery, useMutation } from "@apollo/client"
import { useState } from 'react'
import { UPDATE_USER } from "../api/mutations"
import generateUploadURL from "../../utils/s3"
import { GetServerSideProps } from "next"
import createClient from '../../apollo/client'
import { IS_LOGGED_IN } from "../api/queries"

const Settings = () => {
    const [croppedImageDataUrl, setCroppedImageDataUrl] = useState('')
    const [croppedImageBlob, setCroppedImageBlob] = useState({})

    const toast = useToast()

    const { data } = useQuery(FIND_ME)
    const [bioInput, setBioInput] = useState(data?.findMe?.bio)

    const [updateUser] = useMutation(UPDATE_USER, {
        update(cache, { data: { updateUser: { bio, userImage } } }) {
            const { findMe }: any = cache.readQuery({
                query: FIND_ME,
            });

            cache.writeQuery({
                query: FIND_ME,
                data: {
                    findMe: {
                        ...findMe,
                        bio: bio,
                        userImage: userImage
                    }
                }
            })
        }
    })

    const handleBioInputChange = (e: any) => {
        setBioInput(e)
    }

    const handleFormSubmit = async () => {
        if (croppedImageDataUrl.length > 30) {
            const uploadUrl = await generateUploadURL()

            await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    // @ts-ignore
                    "Content-Type": croppedImageBlob.type
                },
                // @ts-ignore
                body: croppedImageBlob
            })
            const s3ImageUrl = uploadUrl.split('?')[0]

            updateUser({ variables: { bio: bioInput, userImage: s3ImageUrl } })
        } else {
            updateUser({ variables: { bio: bioInput } })
        }
        toast({
            title: "User updated.",
            status: 'success',
            duration: 5000,
        })
    }

    return (
        <Layout>
            <SimpleGrid
                mt={5}
                columns={{
                    md: 3,
                }}
                spacing={{
                    md: 6,
                }}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <GridItem
                    mt={[5, null, 0]}
                    colSpan={{
                        md: 2,
                    }}
                >
                    <Box
                        shadow="base"
                        rounded={[null, "md"]}
                        overflow={{
                            sm: "hidden",
                        }}
                    >
                        <Stack
                            px={4}
                            py={5}
                            bg="white"
                            _dark={{
                                bg: "#141517",
                            }}
                            spacing={6}
                            p={{
                                sm: 6,
                            }}
                        >
                            <GridItem
                                mt={[5, null, 0]}
                                colSpan={{
                                    md: 2,
                                }}
                            >
                                <Box
                                    shadow="base"
                                    rounded={[null, "md"]}
                                    overflow={{
                                        sm: "hidden",
                                    }}
                                >
                                    <Stack
                                        px={4}
                                        py={5}
                                        p={[null, 6]}
                                        bg="white"
                                        _dark={{
                                            bg: "#141517",
                                        }}
                                        spacing={6}
                                    >
                                        <SimpleGrid columns={6} spacing={6}>
                                            <FormControl as={GridItem} colSpan={[6, 3]}>
                                                <FormLabel
                                                    htmlFor="first_name"
                                                    fontSize="sm"
                                                    fontWeight="md"
                                                    color="gray.700"
                                                    _dark={{
                                                        color: "gray.50",
                                                    }}
                                                >
                                                    First name
                                                </FormLabel>
                                                <Input
                                                    type="text"
                                                    name="first_name"
                                                    id="first_name"
                                                    autoComplete="given-name"
                                                    mt={1}
                                                    focusBorderColor="brand.400"
                                                    shadow="sm"
                                                    size="sm"
                                                    w="full"
                                                    rounded="md"
                                                    placeholder="Under maintenance..."
                                                    disabled
                                                />
                                            </FormControl>

                                            <FormControl as={GridItem} colSpan={[6, 3]}>
                                                <FormLabel
                                                    htmlFor="last_name"
                                                    fontSize="sm"
                                                    fontWeight="md"
                                                    color="gray.700"
                                                    _dark={{
                                                        color: "gray.50",
                                                    }}
                                                >
                                                    Last name
                                                </FormLabel>
                                                <Input
                                                    type="text"
                                                    name="last_name"
                                                    id="last_name"
                                                    autoComplete="family-name"
                                                    mt={1}
                                                    focusBorderColor="brand.400"
                                                    shadow="sm"
                                                    size="sm"
                                                    w="full"
                                                    rounded="md"
                                                    placeholder="Under maintenance..."
                                                    disabled
                                                />
                                            </FormControl>

                                            <FormControl as={GridItem} colSpan={[6, 4]}>
                                                <FormLabel
                                                    htmlFor="email_address"
                                                    fontSize="sm"
                                                    fontWeight="md"
                                                    color="gray.700"
                                                    _dark={{
                                                        color: "gray.50",
                                                    }}
                                                >
                                                    Email address
                                                </FormLabel>
                                                <Input
                                                    type="text"
                                                    name="email_address"
                                                    id="email_address"
                                                    autoComplete="email"
                                                    mt={1}
                                                    focusBorderColor="brand.400"
                                                    shadow="sm"
                                                    size="sm"
                                                    w="full"
                                                    rounded="md"
                                                    placeholder="Under maintenance..."
                                                    disabled
                                                />
                                            </FormControl>
                                        </SimpleGrid>
                                    </Stack>
                                </Box>
                            </GridItem>

                            <div>
                                <FormControl id="email" mt={1}>
                                    <FormLabel
                                        fontSize="sm"
                                        fontWeight="md"
                                        color="gray.700"
                                        _dark={{
                                            color: "gray.50",
                                        }}
                                        ml={1}
                                    >
                                        Bio
                                    </FormLabel>
                                    <Textarea
                                        placeholder="Describe yourself"
                                        mt={1}
                                        rows={3}
                                        minH="100px"
                                        maxH="150px"
                                        fontSize="sm"
                                        onChange={(e) => handleBioInputChange(e.currentTarget.value)}
                                        defaultValue={data?.findMe?.bio}
                                    />
                                </FormControl>
                            </div>

                            <FormControl>
                                <FormLabel
                                    fontSize="sm"
                                    fontWeight="md"
                                    color="gray.700"
                                    _dark={{
                                        color: "gray.50",
                                    }}
                                    ml={1}
                                >
                                    Photo
                                </FormLabel>
                                <Flex alignItems="center" mt={1}>
                                    <Avatar
                                        boxSize={12}
                                        ml={1}
                                        src={croppedImageDataUrl || data?.findMe?.userImage}
                                    />
                                    <UserSettingsModal setCroppedImageBlob={setCroppedImageBlob} setCroppedImageDataUrl={setCroppedImageDataUrl} croppedImageDataUrl={croppedImageDataUrl} />
                                </Flex>
                            </FormControl>
                            <Text
                                ml={1}
                                fontSize="sm"
                            >
                                {data?.findMe?.username}
                            </Text>
                        </Stack>
                        <Box
                            px={{
                                base: 4,
                                sm: 6,
                            }}
                            py={3}
                            bg="gray.50"
                            _dark={{
                                bg: "#121212",
                            }}
                            textAlign="right"
                        >
                            <Button
                                colorScheme="twitter"
                                h="30px"
                                height={27.5}
                                onClick={() => handleFormSubmit()}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                </GridItem>
            </SimpleGrid >
        </Layout >
    )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const client = createClient(context)

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

export default Settings