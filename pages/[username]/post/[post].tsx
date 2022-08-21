import React, { useEffect } from 'react';
import Layout from '../../../components/layouts/article'
import { loggedInAtom } from '../../../utils/globalAtoms'
import { useAtom } from 'jotai'
import Router from 'next/router';
import Auth from '../../../utils/clientAuth'

const Post = () => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)

    useEffect(() => {
        if (Auth.loggedIn()) {
            return setLoggedIn(true)
        }
        setLoggedIn(false)
        Router.push('/login')
    })

    return (
        <Layout>
            This is a post
        </Layout>
    )
}

export default Post