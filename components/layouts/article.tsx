import { Box } from "@chakra-ui/react"

const Layout = ({children}: React.PropsWithChildren) => {
    return (
        <Box
            h="100vh"
            w={[350, 400, 700, 980]}
            display="flex"
            justifyContent="start"
            alignItems="center"
            flexDirection="column"
            p="1em"
            mb="1.75em"
        >
            {children}
        </Box>
    )
}

export default Layout