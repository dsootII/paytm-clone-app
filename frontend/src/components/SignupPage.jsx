import React, { useState } from 'react'
import InputBox from './buildingblocks/InputBox'
import Button from './buildingblocks/Button'
import { Link, useNavigate } from 'react-router-dom'
import SigninPage from './SigninPage'
import axios from 'axios';
import DashboardPage from './DashboardPage'


export default function SignupPage(props) {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: ""

    });

    function onInputChange(e) {
        const {name, value} = e.target;
        setCredentials( prev => { return {...prev, [name]: value} } )
    }


    // console.log("component rendered. State: ", credentials);

    function handleSubmit () {
        axios.post("http://localhost:3000/api/v1/user/signup", credentials)
        .then(response => {
            console.log(response)
            if (response.data.msg = "User created successfully") {
                const token = response.data.token;
                localStorage.setItem('token', token);
                navigate('/dashboard');
            }
        })
        .catch(error => console.log(error))
    }
    
    
    
    return (
    <div className='h-screen flex justify-center bg-gray-500' >
        <div className='flex flex-col justify-center'>
            
            <div className='bg-white p-5 rounded-lg shadow-lg'>
            <div className='font-medium text-center'>
                Signup
            </div>
            <div className='font-light text-slate-400 text-center pb-4'>
                Enter your information to create an account.
            </div>

            <div >
                <InputBox placeholder={"Please enter your first name"} name="firstName" label={"First Name"} onChange={onInputChange} type={"text"}/>
                <InputBox placeholder={"Please enter your last name"} name="lastName" label={"Last Name"} onChange={onInputChange} type={"text"}/>
                <InputBox placeholder={"Please enter your email"} name="username" label={"Email"} onChange={onInputChange} type={"email"}/>
                <InputBox placeholder={"Please enter a password"} name="password" label={"Password"} onChange={onInputChange} type={"password"}/>
                <Button className="pt-4" label={"Signup"} onClick={handleSubmit} />
            </div>
            
            <div className="py-2 text-sm flex justify-center">
                <div>
                    Already have an account?
                </div>
                <Link className="pointer underline pl-1 cursor-pointer" to={SigninPage}>
                    Sign in
                </Link>
            </div>
            </div>

        </div>
        
        
    </div>
)}