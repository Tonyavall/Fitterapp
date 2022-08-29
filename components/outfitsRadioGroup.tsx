import {
    useRadio,
    Box,
    useRadioGroup,
    HStack
} from "@chakra-ui/react"
import { cloneElement } from "react"
// 1. Create a component that consumes the `useRadio` hook
function FitsRadioCard(props: any) {
    const { getInputProps, getCheckboxProps } = useRadio(props)

    const input = getInputProps()
    const checkbox = getCheckboxProps()
    console.log(props.children)
    return (
        <Box as='label'>
            <input {...input}/>
            {cloneElement(props.children,
                { ...checkbox, _checked: { opacity: '50%' } },
            )}
        </Box>
    )
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
function OutfitsRadioGroup(props: any) {

    const handleRadioChange = (child:any) => {
        console.log(child)
    }

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'Children',
        defaultValue: props.children,
        onChange: handleRadioChange,
    })

    const group = getRootProps()

    return (
        <HStack {...group}>
            {props.children.map((value: any) => {
                const radio = getRadioProps(value)
                return (
                    <FitsRadioCard key={value._id + 142} {...radio}>
                        {value}
                    </FitsRadioCard>
                )
            })}
        </HStack>
    )
}

export default OutfitsRadioGroup