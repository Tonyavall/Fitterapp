import React, { useEffect } from 'react';
import Layout from '../../components/layouts/article'
import { loggedInAtom } from '../../utils/globalAtoms'
import { useAtom } from 'jotai'
import Router from 'next/router';
import Auth from '../../utils/clientAuth'

const User = () => {
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
            User
        </Layout>
    )
}

export default User