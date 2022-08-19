import LoginForm from "../../components/loginForm"
import { SyntheticEvent } from "react";
import { useState } from "react";
import { useMutation, gql } from '@apollo/client';

import { LOGIN } from '../api/mutations'

const Login = () => {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { error }] = useMutation(LOGIN);
  
    const handleFormSubmit = async (event: SyntheticEvent) => {
      event.preventDefault();
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
  
    const handleChange = (event: SyntheticEvent) => {
      const { name, value } = event.target;
      setFormState({
        ...formState,
        [name]: value,
      });
    };

    return (
        <LoginForm handleChange={handleChange} />
    )
}

export default Login