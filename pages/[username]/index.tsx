import React, { useEffect } from 'react';
import Layout from '../../components/layouts/article'
import { loggedInAtom } from '../../utils/globalAtoms'
import { useAtom } from 'jotai'
import Router from 'next/router';
import Auth from '../../utils/clientAuth'
import { FIND_USER } from '../api/queries';
import client, { addClientState } from '../../apollo/client'
import { GetServerSideProps } from 'next'

interface UserData {
    _id: string
    username: string
    firstName: string
    lastName: string
    userImage: string
    postCount: string
    posts: {
        postImage: string
        outfit: string
    }
}

const User = (what:any) => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)
    console.log(what)

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
// error.networkError.result.errors
export const getServerSideProps: GetServerSideProps = async (context) => {
    if (context.params === undefined) return
    const username = context.params.username
    try {
        const data = await client.query<UserData, any>({
            query: FIND_USER,
            variables: { username }
        })

        return addClientState(client, {
            props: { data },
        })
    } catch (error) {
        const err = JSON.stringify(error)
        return { props: { err } }
    }
}

export default User