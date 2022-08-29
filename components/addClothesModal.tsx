import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    FormControl,
    FormLabel,
    ModalFooter,
    Select,
    Box,
    Center,
    Heading,
    Tabs,
    Tab,
    TabList,
    TabPanel,
    TabPanels
} from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react"
import MediaUpload from "./mediaUpload"
import CropBox from "./cropBox"

function AddClothesModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [image, setImage] = useState([])

    const initialRef = useRef(null)
    const finalRef = useRef(null)

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

    const handleFitAdd = () => {

    }
    console.log(image)

    const handleModalClose = () => {
        setTabIndex(0)
        setImage([])
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
    return (
        <>
            <Button
                colorScheme="twitter"
                size="sm"
                height={27.5}
                onClick={onOpen}
                mr={2.5}
                mb={1}
            >
                Add Clothes
            </Button>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
                size="3xl"
                onCloseComplete={() => handleModalClose()}
            >
                <ModalOverlay />
                <ModalContent
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="2xl"
                    h="750px"
                    w="full"
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
                            <Button onClick={handleFitAdd} bg="white" size="sm">Add</Button>
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
                                <TabPanel p={0} m={0} w="full" h="full">
                                    {/* @ts-ignore */}
                                    <CropBox image={image}/>
                                </TabPanel>
                                <TabPanel p={0} m={0}>
                                    <Select placeholder='Is this a Top, Bottom, or Foowear?' mt={4}>
                                        <option value='top'>Top</option>
                                        <option value='bottom'>Bottom</option>
                                        <option value='footwear'>Footwear</option>
                                    </Select>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddClothesModal