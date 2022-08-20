import SignupForm from "../../components/signupForm";

import { SyntheticEvent } from "react";
import { useState } from "react";
import { useMutation } from '@apollo/client';
import { CREATE_USER } from "../api/mutations";
import Auth from '../../utils/clientAuth';
import Router from "next/router";
const Signup = () => {
    const [formState, setFormState] = useState({
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
    })

    const [createUser, { error }] = useMutation(CREATE_USER);

    const handleFormSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        const fieldValues = Object.values(formState)
        for (let i = 0; i < fieldValues.length; i++) {
            if (fieldValues[i] === '') return
        }

        try {
            const mutationResponse = await createUser({
                variables: {
                    email: formState.email,
                    username: formState.username,
                    password: formState.password,
                    firstName: formState.firstName,
                    lastName: formState.lastName,
                },
            });
            const token = mutationResponse.data.createUser.token;
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
        <SignupForm
            handleChange={handleChange}
            handleFormSubmit={handleFormSubmit}
            error={error}
        />
    )
}

export default Signup