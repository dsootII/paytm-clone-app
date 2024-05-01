import React from 'react'
import InputBox from './buildingblocks/InputBox'
import Button from './buildingblocks/Button'
import { Link } from 'react-router-dom'
import SigninPage from './SigninPage'

export default function SignupPage(props) {

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
                <InputBox placeholder={"Please enter your first name"} label={"First Name"} />
                <InputBox placeholder={"Please enter your last name"} label={"Last Name"} />
                <InputBox placeholder={"Please enter your email"} label={"Email"} />
                <InputBox placeholder={"Please enter a password"} label={"Password"} />
                <Button className="pt-4" label={"Signup"} onClick={()=> alert("button clicked")} />
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