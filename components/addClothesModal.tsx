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
    Center
} from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useRef } from "react"

function AddClothesModal() {
    // serverless uploading to s3 bucket
    // do a get then put request on the bucket
    // https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/

    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = useRef(null)
    const finalRef = useRef(null)
    // final ref will recieve values on close

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
                size={["xl","2xl"]}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Clothes</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Box
                            border="1px dashed black"
                            borderRadius="5px"
                            w="full"
                            h="300px"
                        >
                            <Center my="7.5em">Upload File Here</Center>
                        </Box>

                        <Select placeholder='Is this a Top, Bottom, or Foowear?' mt={4}>
                            <option value='top'>Top</option>
                            <option value='bottom'>Bottom</option>
                            <option value='footwear'>Footwear</option>
                        </Select>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="twitter"
                            size="sm"
                            height={27.5}
                            mr={4}
                        >
                            Upload
                        </Button>
                        <Button
                            colorScheme="twitter"
                            size="sm"
                            height={27.5}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddClothesModal