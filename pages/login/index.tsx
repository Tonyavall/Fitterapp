import LoginForm from "../../components/loginForm"
import { SyntheticEvent } from "react";
import { useState } from "react";
import { useMutation, gql } from '@apollo/client';

import { LOGIN } from '../api/mutations'
import Auth from '../../utils/clientAuth';

const Login = () => {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { error }] = useMutation(LOGIN);

    const handleFormSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        if (!formState.email || !formState.password) return

        try {
            const mutationResponse = await login({
                variables: { email: formState.email, password: formState.password },
            });
            const token = mutationResponse.data.login.token;
            Auth.login(token);
        } catch (e) {
            console.log(e);
        }
    };

    const handleChange = (event: any) => {
        const userInput = event.target.value
        const fieldType = event.target.type
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