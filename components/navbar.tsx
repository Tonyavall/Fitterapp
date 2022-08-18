import Link from 'next/link'
import { Box } from "@chakra-ui/react"

const Navbar = () => {
    const navLinks = [
        {
            name: 'Home',
            link: '/'
        },
        {
            name: 'Profile',
            link: '/profile'
        },
        {
            name: 'Discover',
            link: '/discover'
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