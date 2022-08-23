import type { NextPage } from 'next'
import Layout from '../components/layouts/article'
import { useAtom } from 'jotai'
import { loggedInAtom } from '../utils/globalAtoms'
import { useEffect } from 'react'
import Router from 'next/router'
import Auth from '../utils/clientAuth'
import { userProfileAtom } from '../utils/globalAtoms'
// import { GetServerSideProps } from 'next'
// import { Box, Image } from '@chakra-ui/react'
// import { addClientState } from '../apollo/client'
// import client from '../apollo/client'


const Home: NextPage = () => {
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)
  const [userProfile, setUserProfile] = useAtom(userProfileAtom)

  useEffect(() => {
    if (Auth.loggedIn()) {
      return setLoggedIn(true)
    }
    setLoggedIn(false)
    Router.push('/login')
  }, [setLoggedIn])

  return (
    <Layout>
      <p>
        This will be the homepage for the users
      </p>
    </Layout>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   if (context.params === undefined) return
//   const username = context.params.username

//   try {
//     const data = await client.query<any, any>({
//       query: FIND_USER,
//       variables: { username }
//     })

//     return addClientState(client, {
//       props: { data },
//     })
//   } catch (error) {
//     return {
//       notFound: true,
//     }
//   }
// }

export default Home
