import React, { useState } from 'react'
import InputBox from './buildingblocks/InputBox'
import Button from './buildingblocks/Button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function SigninPage(props) {
    const {setToken} = useAuthContext();
    const navigate = useNavigate();
    const [loginDetails, setLoginDetails] = useState({
        username: '',
        password: ''
    });

    function onInputChange(e) {
        const {name, value} = e.target;
        setLoginDetails(prev => {
            return {
                ...prev,
                [name]: value
            }
        });
    }

    function handleSubmit() {
        axios.post("http://localhost:3000/api/v1/user/signin", loginDetails)
        .then(response => {
            console.log(response);
            try {
                const token = response.data.token;
                setToken(token);
                const dashboardData = {
                    firstName: response.data.firstName,
                    lastName: response.data.lastName, 
                    balance: response.data.balance
                }
                navigate('/dashboard', {state: dashboardData} );
            } catch (error) {
                console.log(error);
                navigate("/signin");
            }
        })
    }

    return( 
    <div className='h-screen flex justify-center bg-gray-300'>
        <div className='flex flex-col justify-center'>

            <div className='bg-white p-5 rounded-lg shadow-lg'>
                <div className='font-medium text-center'>
                    Signin
                </div>
                <div className='font-light text-slate-400 text-center pb-4'>
                    Enter your credentials to log in.
                </div>

                <InputBox placeholder={"Please enter your email"} name="username" label={"Email"} type={"email"} onChange={onInputChange}/>
                <InputBox placeholder={"Please enter a password"} name="password" label={"Password"} type={"password"} onChange={onInputChange}/>
                <Button label={"Sign In"} onClick={handleSubmit} />
            </div>

        </div>
    </div>
)}