import React from 'react'
import InputBox from './buildingblocks/InputBox'
import Button from './buildingblocks/Button'
import { Link } from 'react-router-dom'

export default function SigninPage(props) {

    return( 
    <div className='h-screen flex justify-center bg-gray-500'>
        <div className='flex flex-col justify-center'>

            <div className='bg-white p-5 rounded-lg shadow-lg'>
                <div className='font-medium text-center'>
                    Signin
                </div>
                <div className='font-light text-slate-400 text-center pb-4'>
                    Enter your credentials to log in.
                </div>

                <InputBox placeholder={"Please enter your email"} label={"Email"} />
                <InputBox placeholder={"Please enter a password"} label={"Password"} />
                <Button label={"Sign In"} onClick={() => alert("signin button clicked")} />
            </div>

        </div>
    </div>
)}