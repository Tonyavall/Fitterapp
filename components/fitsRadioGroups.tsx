import {
    Image,
    GridItem,
    useToast,
    useRadio,
    chakra,
    useRadioGroup,
    Icon,
    Button,
    Box,
    CloseButton
} from "@chakra-ui/react"
import { useMutation } from "@apollo/client"
import { DELETE_TOP } from "../pages/api/mutations"
import { DELETE_BOTTOM } from "../pages/api/mutations"
import { DELETE_FOOTWEAR } from "../pages/api/mutations"
import { GrFormClose } from 'react-icons/gr'

// IMPLEMENT UPDATING THE COMPONENT !!!
// passive event listener error
function FitsRadio(props: any) {
    const { image, type, _id, ...radioProps } = props
    const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
        useRadio(radioProps)
    const [deleteTop] = useMutation(DELETE_TOP)
    const [deleteBottom] = useMutation(DELETE_BOTTOM)
    const [deleteFootwear] = useMutation(DELETE_FOOTWEAR)

    const handleFitDelete = (e: any) => {
        const fitId = e.currentTarget.id
        const fitType = e.currentTarget.dataset.type

        switch (fitType) {
            case 'top':
                deleteTop({ variables: { topId: fitId } })
                break;
            case 'bottom':
                deleteBottom({ variables: { bottomId: fitId } })
                break;
            case 'footwear':
                deleteFootwear({ variables: { footwearId: fitId } })
                break;
        }
    }

    return (
        <chakra.label {...htmlProps} cursor='pointer' position="relative">
            <input {...getInputProps({})} hidden />
            <Icon
                as={GrFormClose}
                id={_id}
                data-type={type}
                position="absolute"
                zIndex={20}
                right={0}
                boxSize="17.5px"
                onClick={(e) => handleFitDelete(e)}
            />
            <Image
                bg="lightgray"
                alt="Picture of a top"
                boxSize={[65, 86, 145, 186, 186]}
                objectFit="cover"
                src={image}
                data-topid={_id}
                {...getCheckboxProps()}
                {...getLabelProps()}
                opacity={state.isChecked ? '50%' : '100%'}
            />
        </chakra.label>
    )
}

const FitsRadioGroup = ({ cloth, setSelectedFits, selectedFits }: any) => {
    const toast = useToast()
    // I'm extremely lazy so I stringified and parsed the incoming value I 
    // don't know what data transformations they do
    const handleChange = (value: any) => {
        const fit = JSON.parse(value)
        const type = fit.__typename.toLowerCase()  

        toast({
            title: `${type} selected`,
            status: 'info',
            duration: 1000,
        })

        setSelectedFits({
            ...selectedFits,
            [type]: { _id: fit._id, image: fit.image }
        })
    }

    const { getRadioProps, getRootProps } = useRadioGroup({
        defaultValue: 'Error',
        onChange: handleChange,
    })
    return (
        <>
            <GridItem
                key={cloth._id}
                {...getRootProps()}
            >
                <FitsRadio
                    key={cloth._id}
                    image={cloth.image}
                    _id={cloth._id}
                    type={cloth.__typename.toLowerCase()}
                    // @ts-ignore
                    {...getRadioProps({ value: JSON.stringify(cloth) })}
                />
            </GridItem>
        </>
    )
}

export default FitsRadioGroup