import LoginForm from "../../components/loginForm"
import { SyntheticEvent } from "react";
import { useState } from "react";
import { useMutation } from '@apollo/client';

import { LOGIN } from '../api/mutations'
import Auth from '../../utils/clientAuth';

const Login = () => {
    const [formState, setFormState] = useState({ username: '', password: '' });
    const [login, { error }] = useMutation(LOGIN);

    const handleFormSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!formState.username || !formState.password) return

        try {
            const mutationResponse = await login({
                variables: { username: formState.username, password: formState.password },
            });
            console.log(mutationResponse)
            const token = mutationResponse.data.login.token;
            console.log(token)
            Auth.login(token);
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