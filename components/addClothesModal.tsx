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
    TabPanels,
    Image,
    useToast
} from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react"
import MediaUpload from "./mediaUpload"
import CropBox from "./cropBox"
import generateUploadURL from "../utils/s3"
import { ADD_BOTTOM, ADD_TOP, ADD_FOOTWEAR } from "../pages/api/mutations"
import { FIND_FITS } from "../pages/api/queries"
import { useMutation } from "@apollo/client"

function AddClothesModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [image, setImage] = useState([])
    const [croppedImageBlob, setCroppedImageBlob] = useState({})
    const [croppedImageDataUrl, setCroppedImageDataUrl] = useState('')
    const [fitType, setFitType] = useState('')
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const toast = useToast()

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

    const [addTop] = useMutation(ADD_TOP, {
        update(cache, { data: { addTop: { tops } } }) {
            //retrieve cached query value from memory
            const { findFits }: any = cache.readQuery({
                query: FIND_FITS
            });
            //manipulate fitsQueryResult, writeQuery
            cache.writeQuery({
                query: FIND_FITS,
                data: {
                    findFits: {
                        ...findFits,
                        tops: tops,
                    }
                }
            })
        }
    })

    const [addBottom] = useMutation(ADD_BOTTOM, {
        update(cache, { data: { addBottom: { bottoms } } }) {
            //retrieve cached query value from memory
            const { findFits }: any = cache.readQuery({
                query: FIND_FITS
            });
            //manipulate fitsQueryResult, writeQuery
            cache.writeQuery({
                query: FIND_FITS,
                data: {
                    findFits: {
                        ...findFits,
                        bottoms: bottoms,
                    }
                }
            })
        }
    })

    const [addFootwear] = useMutation(ADD_FOOTWEAR, {
        update(cache, { data: { addFootwear: { footwear } } }) {
            //retrieve cached query value from memory
            const { findFits }: any = cache.readQuery({
                query: FIND_FITS
            });
            //manipulate fitsQueryResult, writeQuery
            cache.writeQuery({
                query: FIND_FITS,
                data: {
                    findFits: {
                        ...findFits,
                        footwear: footwear,
                    }
                }
            })
        }
    })

    const handleFitAdd = async () => {
        try {
            if (!fitType) {
                toast({
                    title: 'Please select a fit type.',
                    status: 'error',
                    duration: 1500,
                })
                return
            }

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

            // Handling data/backend here
            switch (fitType) {
                case 'top':
                    addTop({ variables: { image: s3ImageUrl } })
                    break;
                case 'bottom':
                    addBottom({ variables: { image: s3ImageUrl } })
                    break;
                case 'footwear':
                    addFootwear({ variables: { image: s3ImageUrl } })
                    break;
                default:
                    break;
            }
            // finally closing the modal
            onClose()
        } catch (error) {
            console.log(error)
        }
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
                    borderRadius="15px"
                    h="744px"
                    w="700px"
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
                                    flexDirection="column"
                                >
                                    <Image
                                        // @ts-ignore
                                        src={croppedImageDataUrl}
                                        alt="Image of a top/bottom/footwear"
                                        h="500px"
                                        w="500px"
                                    />

                                    <Select
                                        placeholder='Is this a Top, Bottom, or Foowear?'
                                        mt={4}
                                        width="50%"
                                        onChange={(e) => setFitType(e.currentTarget.value)}
                                    >
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