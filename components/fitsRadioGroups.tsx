import {
    Image,
    GridItem,
    useToast,
    useRadio,
    chakra,
    useRadioGroup,
    Icon,
    Radio,
    Button,
    Box,
    CloseButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton
} from "@chakra-ui/react"
import { useMutation } from "@apollo/client"
import {
    DELETE_TOP,
    DELETE_BOTTOM,
    DELETE_FOOTWEAR
} from "../pages/api/mutations"
import { FIND_FITS } from "../pages/api/queries"
import { BiDotsHorizontalRounded } from 'react-icons/bi'
// IMPLEMENT UPDATING THE COMPONENT !!!
// passive event listener error

function FitsRadio(props: any) {
    const { image, type, _id, ...radioProps } = props
    const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
        useRadio(radioProps)
    const [deleteTop] = useMutation(DELETE_TOP, {
        update(cache, { data: { deleteTop: { tops } } }) {
            //retrieve cached query value from memory
            const { findMe }: any = cache.readQuery({
                query: FIND_FITS
            });
            //manipulate fitsQueryResult, writeQuery
            cache.writeQuery({
                query: FIND_FITS,
                data: {
                    findMe: {
                        ...findMe,
                        tops: tops,
                    }
                }
            })
        }
    })
    const [deleteBottom] = useMutation(DELETE_BOTTOM, {
        update(cache, { data: { deleteBottom: { bottoms } } }) {
            //retrieve cached query value from memory
            const { findMe }: any = cache.readQuery({
                query: FIND_FITS
            });
            //manipulate fitsQueryResult, writeQuery
            cache.writeQuery({
                query: FIND_FITS,
                data: {
                    findMe: {
                        ...findMe,
                        bottoms: bottoms,
                    }
                }
            })
        }
    })

    const [deleteFootwear] = useMutation(DELETE_FOOTWEAR, {
        update(cache, { data: { deleteFootwear: { footwear } } }) {
            //retrieve cached query value from memory
            const { findMe }: any = cache.readQuery({
                query: FIND_FITS
            });
            //manipulate fitsQueryResult, writeQuery
            cache.writeQuery({
                query: FIND_FITS,
                data: {
                    findMe: {
                        ...findMe,
                        footwear: footwear,
                    }
                }
            })
        }
    })

    const handleFitDelete = (e: any) => {
        const fitId = e.currentTarget.dataset.id
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
            <Menu placement="bottom-start">
                <MenuButton
                    border="none"
                    as={IconButton}
                    aria-label='Options'
                    icon={<BiDotsHorizontalRounded />}
                    variant='outline'
                    position="absolute"
                    zIndex={20}
                    left={0}
                    boxSize="17.5px"
                />
                <MenuList display="flex" h={10}>
                    <MenuItem
                        command='⌘T'
                        data-id={_id}
                        data-type={type}
                        onClick={(e) => handleFitDelete(e)}
                    >
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
            <Image
                bg="lightgray"
                alt="Picture of a top"
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

const FitsRadioGroup = ({ fits, setSelectedFits, selectedFits }: any) => {
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
            {fits?.map((fit: any) => {
                return (
                    <GridItem
                        key={fit._id}
                        {...getRootProps()}
                    >
                        <FitsRadio
                            key={fit._id}
                            image={fit.image}
                            _id={fit._id}
                            type={fit.__typename.toLowerCase()}
                            {...getRadioProps({ value: JSON.stringify(fit) })}
                        />
                    </GridItem>
                )
            })}
        </>
    )
}

export default FitsRadioGroup