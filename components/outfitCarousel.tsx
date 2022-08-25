import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { useState } from "react"
// @ts-ignore
import Slider from 'react-slick'
import {
    Box,
    IconButton,
    useBreakpointValue,
    Image,
} from "@chakra-ui/react";

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

const OutfitCarousel = ({ _id, tops = {}, bottoms = {}, footwear = {} }: any) => {
    const [slider, setSlider] = useState<Slider | null>(null);
    const top = useBreakpointValue({ base: '90%', md: '50%' });
    const side = useBreakpointValue({ base: '30%', md: '40px' });

    return (
        <>
            <Box
                key={_id + 10724}
                boxSize={[105, 125, 206, 300, 300]}
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
                    top={top}
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
                    top={top}
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
                        key={_id + 512}
                        position="relative"
                        alt="Picture of top"
                        objectFit="cover"
                        src={tops.image}
                    />
                    <Image
                        key={_id + 512}
                        position="relative"
                        alt="Picture of bottom"
                        objectFit="cover"
                        src={bottoms.image}
                    />
                    {footwear ?
                        <Image
                            key={_id + 512}
                            position="relative"
                            alt="Picture of footwear"
                            objectFit="cover"
                            src={footwear.image}
                        />
                        :
                        null
                    }

                </Slider>
            </Box>
        </>
    )
}

export default OutfitCarousel