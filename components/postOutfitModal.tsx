import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Box,
    Heading,
    Tabs,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Image,
    useToast,
    useDisclosure,
    Avatar,
    Text,
    Textarea
} from "@chakra-ui/react"
import { useRef, useState } from "react"
import MediaUpload from "./mediaUpload"
import CropBox from "./cropBox"
import generateUploadURL from "../utils/s3"
import { CREATE_POST } from "../pages/api/mutations"
import { useMutation } from "@apollo/client"
import PostCarousel from "./postOutfitModalCarousel"
import { userProfileAtom } from "../lib/globalAtoms"
import { useAtomValue } from "jotai"

function PostOutfitModal({ outfitId, topImage, bottomImage, footwearImage = null }: any) {
    // THIS DISCLOSURE IS FOR THE MODAL ITSELF
    const { isOpen, onOpen, onClose } = useDisclosure()
    // THIS DISCLOSURE IS FOR SLIDE OUT TRANSITION ON TAB INDEX 2
    const [image, setImage] = useState([])
    const [croppedImageBlob, setCroppedImageBlob] = useState({})
    const [croppedImageDataUrl, setCroppedImageDataUrl] = useState('')
    const [fitType, setFitType] = useState('')
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const toast = useToast()
    const userProfile = useAtomValue(userProfileAtom)

    const [captionData, setCaptionData] = useState('')
    const [createPost, { error }] = useMutation(CREATE_POST)
    // tab index starts at 0
    const [tabIndex, setTabIndex] = useState(0)
    // Hardcoded tab value, if adding/removing tabs please change this.
    const maxTabs = 3

    const handleButtonBackward = () => {
        if (tabIndex === 0) return
        setTabIndex(tabIndex - 1)
    }

    const handleButtonForward = () => {
        if (tabIndex === maxTabs - 1) return
        setTabIndex(tabIndex + 1)
    }

    const handleModalClose = () => {
        setTabIndex(0)
        setImage([])
        setFitType('')
    }

    const handleHeadingTitle = (index: number) => {
        switch (index) {
            case 1:
                return "Crop"
            case 2:
                return "Fit Type"
            default:
                return "Upload Fit"
        }
    }

    // If the user has not selected an outfit, return
    const handleModalOpen = () => {
        if (!outfitId) {
            toast({
                title: 'Please select an outfit to post!',
                status: 'error',
                duration: 1500,
            })
            return
        }
        onOpen()
    }

    const handlePostOutfit = async () => {
        // grab caption data
        // make a request to aws to grab url
        // post data to aws after url grabbed
        // make request to backend with url data from aws
        try {
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
            createPost({
                variables: {
                    outfitId: outfitId,
                    postImage: s3ImageUrl,
                    description: captionData
                }
            })
            if (error) return toast({
                title: "An error occured.",
                status: 'error',
                duration: 1500,
            })
            toast({
                title: "Post Created.",
                status: 'success',
                duration: 5000,
            })
            onClose()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Button
                colorScheme="twitter"
                size="sm"
                height={27.5}
                onClick={handleModalOpen}
                mr={2.5}
            >
                Post Outfit
            </Button>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
                size="6xl"
                onCloseComplete={() => handleModalClose()}
            >
                <ModalOverlay />
                <ModalContent
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="15px"
                    h="743px"
                    w="fit-content"
                >
                    <ModalHeader
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        w="full"
                        p=".25em"
                        borderBottom="1px solid lightgray"
                    >
                        <Button onClick={handleButtonBackward} bg="white" size="sm" visibility={tabIndex !== 0 ? "initial" : "hidden"}>Back</Button>
                        <Heading size="sm" fontWeight="md">{handleHeadingTitle(tabIndex)}</Heading>
                        {tabIndex === maxTabs - 1 ?
                            <Button onClick={handlePostOutfit} bg="white" size="sm">Share</Button>
                            :
                            <Button onClick={handleButtonForward} bg="white" size="sm" visibility={tabIndex !== 0 ? "initial" : "hidden"}>Next</Button>
                        }
                    </ModalHeader>

                    <ModalBody
                        p={0} m={0}
                        w="full"
                        h="full"
                    >
                        <Tabs index={tabIndex}
                            w="full"
                            h="full"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <TabList hidden={true}>
                                <Tab>One</Tab>
                                <Tab>Two</Tab>
                                <Tab>Three</Tab>
                            </TabList>
                            <TabPanels w="full" h="full">
                                <TabPanel
                                    p={0}
                                    m={0}
                                    w="full"
                                    h="full"
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <MediaUpload image={image} setImage={setImage} setTabIndex={setTabIndex} />
                                </TabPanel>
                                <TabPanel
                                    p={0}
                                    m={0}
                                    w="full"
                                    h="full"
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    {/* @ts-ignore */}
                                    <CropBox setCroppedImageBlob={setCroppedImageBlob} setCroppedImageDataUrl={setCroppedImageDataUrl} image={image} />
                                </TabPanel>
                                <TabPanel
                                    p={0}
                                    m={0}
                                    w="full"
                                    h="full"
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    flexDirection="row"
                                >
                                    <Image
                                        // @ts-ignore
                                        src={croppedImageDataUrl}
                                        alt="Image of a top/bottom/footwear"
                                        h="700px"
                                        w="700px"
                                        borderRadius="0 0 0 15px"
                                    />

                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="start"
                                        justifyContent="start"
                                        w="340px"
                                        h="full"
                                    >
                                        <PostCarousel
                                            outfitId={outfitId}
                                            topImage={topImage}
                                            bottomImage={bottomImage}
                                            footwearImage={footwearImage}
                                        />

                                        <Box
                                            w="full"
                                            p="1em"
                                        >
                                            <Box
                                                display="flex"
                                                flexDirection="row"
                                                alignItems="center"
                                            >
                                                <Avatar src={userProfile?.userImage} size="sm" mr="1em" />
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize=".95em"
                                                >
                                                    {userProfile?.username}
                                                </Text>
                                            </Box>

                                            <Textarea
                                                mt="1em"
                                                h="275px"
                                                maxH="275px"
                                                borderRadius="0"
                                                placeholder="Write a caption..."
                                                fontSize="sm"
                                                onChange={(e) => setCaptionData(e.target.value)}
                                            />
                                        </Box>
                                    </Box>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default PostOutfitModal