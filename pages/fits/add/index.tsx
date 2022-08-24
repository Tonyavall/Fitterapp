import { useAtom } from "jotai"
import { loggedInAtom } from "../../../utils/globalAtoms"
import { useEffect } from "react"
import Router from "next/router"
import Auth from "../../../utils/clientAuth"
import Layout from "../../../components/layouts/article"
import {
    Box,
    Heading,
    Divider
} from "@chakra-ui/react"

const Add = () => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)

    useEffect(() => {
        if (Auth.loggedIn()) {
            return setLoggedIn(true)
        }
        setLoggedIn(false)
        Router.push('/login')
    }, [setLoggedIn])

    return (
        <Layout>
            <Box
                w="full"
                height="fit-content"
                display="flex"
                flexDirection="column"
                alignItems="start"
            >
                <Heading
                    fontWeight="light"
                    fontSize="2rem"
                    textAlign="left"
                    mx="1em"
                    mt="1em"
                >
                    Add a Top/Bottom/Footwear
                </Heading>
                <Divider borderColor="gray" my="1em" />
            </Box>
        </Layout>
    )
}

export default Add