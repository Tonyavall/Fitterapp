import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation Login(
        $email: String!, 
        $username: String!,
        $firstName: String!,
        $lastName: String!,
        $password: String!,
    ) {
        Login(
            email: $email,
            username: $username,
            firstName: $firstName,
            lastName: $lastName,
            password: $password
        ) {
            token
            user {
                _id
            }
        }
    }
`