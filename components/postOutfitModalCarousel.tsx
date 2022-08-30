import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { useState } from "react"
// @ts-ignore
import Slider from 'react-slick'
import {
    Box,
    IconButton,
    useBreakpointValue,
    Image,
    MenuButton,
    MenuList,
    MenuItem,
    Menu,
} from "@chakra-ui/react";
import { BiDotsHorizontalRounded } from 'react-icons/bi'

const settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const PostOutfitModalCarousel = ({ outfitId, topImage, bottomImage, footwearImage = ''}: any) => {
    const [slider, setSlider] = useState<Slider | null>(null);
    const topSide = useBreakpointValue({ base: '90%', md: '50%' });
    const side = useBreakpointValue({ base: '30%', md: '40px' });

    return (
            <Box
                key={outfitId + 10724}
                boxSize="340px"
                cursor="pointer"
                overflow={'hidden'}
                position="relative"
            >
                <link
                    rel="stylesheet"
                    type="text/css"
                    charSet="UTF-8"
                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
                />
                {/* Left Icon */}
                <IconButton
                    aria-label="left-arrow"
                    variant="ghost"
                    position="absolute"
                    left={side}
                    top={topSide}
                    transform={'translate(-75%, -50%)'}
                    zIndex={2}
                    onClick={() => slider?.slickPrev()}
                    size="sm"
                >
                    <BiLeftArrowAlt size="20px" />
                </IconButton>
                {/* Right Icon */}
                <IconButton
                    aria-label="right-arrow"
                    variant="ghost"
                    position="absolute"
                    right={side}
                    top={topSide}
                    transform={'translate(75%, -50%)'}
                    zIndex={2}
                    onClick={() => slider?.slickNext()}
                    size="sm"
                >
                    <BiRightArrowAlt size="20px" />
                </IconButton>
                {/* Slider */}
                <Slider {...settings} ref={(slider: any) => setSlider(slider)}>
                    <Image
                        key={outfitId + 513}
                        position="relative"
                        alt="Picture of top"
                        objectFit="cover"
                        src={topImage}
                    />
                    <Image
                        key={outfitId + 514}
                        position="relative"
                        alt="Picture of bottom"
                        objectFit="cover"
                        src={bottomImage}
                    />
                    {footwearImage ?
                        <Image
                            key={outfitId + 512}
                            position="relative"
                            alt="Picture of footwear"
                            objectFit="cover"
                            src={footwearImage}
                        />
                        :
                        null
                    }

                </Slider>
            </Box>
    )
}

export default PostOutfitModalCarousel