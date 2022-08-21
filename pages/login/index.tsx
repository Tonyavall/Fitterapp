import LoginForm from "../../components/loginForm"
import { SyntheticEvent, useContext } from "react";
import { useState } from "react";
import { useMutation } from '@apollo/client';

import { LOGIN } from '../api/mutations'
import Auth from '../../utils/clientAuth';

import { loggedInAtom } from '../../utils/globalAtoms'
import { useAtom } from 'jotai'

const Login = () => {
    const [formState, setFormState] = useState({ username: '', password: '' });
    const [login, { error }] = useMutation(LOGIN);
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)

    const handleFormSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!formState.username || !formState.password) return

        try {
            const mutationResponse = await login({
                variables: { username: formState.username, password: formState.password },
            });
            // NEED TO HANDLE ERROR MESSAGES FROM BACKEND HERE
            const token = mutationResponse.data.login.token;
            Auth.login(token);
            setLoggedIn(true)
        } catch (e) {
            console.log(e);
        }
    };

    const handleChange = (event: any) => {
        const userInput = event.target.value
        const fieldType = event.target.dataset.input

        setFormState({
            ...formState,
            [fieldType]: userInput,
        });
    };

    return (
        <LoginForm 
        handleChange={handleChange} 
        error={error}
        handleFormSubmit={handleFormSubmit}
        />
    )
}

export default Login