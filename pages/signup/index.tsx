import SignupForm from "../../components/signupForm";

import { SyntheticEvent } from "react";
import { useState } from "react";
import { useMutation } from '@apollo/client';
import { CREATE_USER } from "../api/mutations";
import Auth from '../../utils/clientAuth';

import { loggedInAtom } from '../../utils/globalAtoms'
import { useAtom } from 'jotai'

const Signup = () => {
    const [formState, setFormState] = useState({
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
    })
    const reservedNames = [
        'settings',
        'fits',
        'explore',
        'direct',
        'store',
        'login',
        'signup',
        'activity'
    ]
    
    const [errorMessage, setErrorMessage] = useState('')
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)
    const [createUser, { error }] = useMutation(CREATE_USER);

    const handleFormSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        const fieldValues = Object.values(formState)
        for (let i = 0; i < fieldValues.length; i++) {
            if (fieldValues[i] === '') {
                setErrorMessage("Please fill out the entire form.")
                return
            }
        }
        for (let i = 0; i < reservedNames.length; i++) {
            if (reservedNames[i] === formState.username) {
                setErrorMessage(`The username ${formState.username} is unavailable.`)
                return
            }
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
            setLoggedIn(true)
            Auth.login(token);
        } catch (e) {
            console.log(e);
        }
    };

    const handleChange = (event: any) => {
        const userInput = event.target.value
        const fieldType = event.target.dataset.input
        const handleInput = (fieldType === 'username') ? userInput.toLowerCase() : userInput

        setFormState({
            ...formState,
            [fieldType]: handleInput,
        });
    };
    return (
        <SignupForm
            handleChange={handleChange}
            handleFormSubmit={handleFormSubmit}
            errorMessage={errorMessage}
        />
    )
}

export default Signup