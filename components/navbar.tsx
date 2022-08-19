import Link from 'next/link'
import { Box } from "@chakra-ui/react"

const Navbar = () => {
    const navLinks = [
        {
            name: 'Fitter',
            link: '/'
        },
        {
            name: 'Profile',
            link: '/profile'
        },
        {
            name: 'Explore',
            link: '/explore'
        },
        {
            name: 'Fits',
            link: '/fits'
        },
        {
            name: 'Store',
            link: '/store'
        },
        {
            name: 'Activity',
            link: '/activity'
        }
    ]

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            {
                navLinks.map(item => {
                    return (
                        <Link href={item.link} key={item.name}>
                            <button>
                                {item.name}
                            </button>
                        </Link>
                    )
                })
            }
        </Box>
    )
}

export default Navbar