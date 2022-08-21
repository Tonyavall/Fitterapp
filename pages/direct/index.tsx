import Layout from "../../components/layouts/article"
import { useAtom } from 'jotai'
import { loggedInAtom } from '../../utils/globalAtoms'
import { useEffect } from "react"
import Router from "next/router"
import Auth from "../../utils/clientAuth"

const Direct = () => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)

    useEffect(() => {
        if (Auth.loggedIn()) {
            return setLoggedIn(true)
        }
        setLoggedIn(false)
        Router.push('/login')
    }, [])

    return (
        <Layout>
            Direct
        </Layout>
    )
}

export default Direct