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

function UserSettingsModal({ setCroppedImageBlob, setCroppedImageDataUrl, croppedImageDataUrl }: any) {
    // THIS DISCLOSURE IS FOR THE MODAL ITSELF
    const { isOpen, onOpen, onClose } = useDisclosure()
    // THIS DISCLOSURE IS FOR SLIDE OUT TRANSITION ON TAB INDEX 2
    const [image, setImage] = useState([])
    const [fitType, setFitType] = useState('')
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const toast = useToast()
    const userProfile = useAtomValue(userProfileAtom)
    
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
    }

    const handleHeadingTitle = (index: number) => {
        switch (index) {
            case 1:
                return "Crop"
            case 1:
                return "Update Picture"
            default:
                return "Update Picture"
        }
    }

    return (
        <>
            <Button
                colorScheme="twitter"
                size="sm"
                height={27.5}
                onClick={onOpen}
                ml={5}
            >
                Change
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
                            <Button onClick={onClose} bg="white" size="sm">Upload</Button>
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
                                >
                                    <Image
                                        // @ts-ignore
                                        src={croppedImageDataUrl}
                                        alt="Image of a top/bottom/footwear"
                                        h="700px"
                                        w="700px"
                                        borderRadius="0 0 15px 15px"
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UserSettingsModal