import React from 'react'
import InputBox from './buildingblocks/InputBox'
import Button from './buildingblocks/Button'

export default function SignupPage(props) {

    return <div>
        <InputBox placeholder={"Please enter your first name"} label={"First Name"} />
        <InputBox placeholder={"Please enter your last name"} label={"Last Name"} />
        <InputBox placeholder={"Please enter your email"} label={"Email"} />
        <InputBox placeholder={"Please enter a password"} label={"Password"} />
        <Button label={"Signup"} onClick={()=> alert("button clicked")} />
        
        
    </div>
}