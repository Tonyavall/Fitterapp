import type { NextPage } from 'next'
import Layout from '../components/layouts/article'
import { useAtom } from 'jotai'
import { loggedInAtom } from '../utils/globalAtoms'
import { useEffect } from 'react'
import Router from 'next/router'
import Auth from '../utils/clientAuth'

const Home: NextPage = () => {
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
      <p>
        This will be the homepage for the users
      </p>
    </Layout>
  )
}

export default Home
