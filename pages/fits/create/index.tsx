import { useAtom } from "jotai"
import { loggedInAtom } from "../../../utils/globalAtoms"
import { useEffect } from "react"
import Router from "next/router"
import Auth from "../../../utils/clientAuth"
import Layout from "../../../components/layouts/article"
import { Box, Heading } from "@chakra-ui/react"

const Fits = () => {
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
            This is to create a fit page
        </Layout>
    )
}

export default Fits