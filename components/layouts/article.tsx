import { Box } from "@chakra-ui/react"

const Layout = ({children}: React.PropsWithChildren) => {
    return (
        <Box
            h="fit-content"
            w={[375, 480, 780, 980, 980]}
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