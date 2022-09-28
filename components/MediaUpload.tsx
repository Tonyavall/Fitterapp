import ImageUploading, { ImageListType } from "react-images-uploading";
import {
    Box,
    Button,
    Heading,
    Icon,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription
} from "@chakra-ui/react";
import { TbDragDrop } from 'react-icons/tb';

// Drag and drop component
const MediaUpload = ({ setImage, image, setTabIndex }: any) => {
    const onChange = (
        imageList: ImageListType
    ) => {
        setImage(imageList as never[])
        // Setting tab index to what should be the 'crop' tab
        setTabIndex(1)
    }

    const acceptType = ['jpg', 'png']

    return (
        <ImageUploading
            value={image}
            onChange={onChange}
            acceptType={acceptType}
        >
            {({
                onImageUpload,
                isDragging,
                dragProps,
                errors
            }) => (
                // Upload image wrapper
                <Box
                    w="700px"
                    h="700px"
                    bg={isDragging ? "gray.300" : "inherit"}
                    {...dragProps}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                >
                    <Icon as={TbDragDrop} boxSize="100px" strokeWidth="1px"></Icon>
                    <Heading
                        fontSize="lg"
                        fontWeight="light"
                        mb="1em"
                    >
                        Drag photos and videos here
                    </Heading>
                    <Button
                        colorScheme="twitter"
                        size="sm"
                        height={27.5}
                        onClick={onImageUpload}
                    >
                        Select from computer
                    </Button>
                    {errors?.maxFileSize &&
                        <Alert
                            status='error'
                            w="300px"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                            borderRadius="md"
                            margin="1em"
                        >
                            <AlertIcon />
                            <AlertTitle>Max File Size</AlertTitle>
                            <AlertDescription>File must be below 5gb</AlertDescription>
                        </Alert>
                    }
                    {errors?.acceptType &&
                        <Alert
                            status='error'
                            w="300px"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                            borderRadius="md"
                            margin="1em"
                        >
                            <AlertIcon />
                            <AlertTitle fontSize=".90rem">Type Error</AlertTitle>
                            <AlertDescription fontSize=".8rem">Please select a png or jpg file.</AlertDescription>
                        </Alert>
                    }
                </Box>
            )}
        </ImageUploading>
    );
}

export default MediaUpload;
