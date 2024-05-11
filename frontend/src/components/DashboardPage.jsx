import React, { useEffect, useState } from 'react'
import BalanceDisplay from './buildingblocks/BalanceDisplay'
import UsersList from './buildingblocks/UsersList'
import { useLocation } from 'react-router-dom'
import DashboardDropdownMenu from './buildingblocks/DashboardDropdownMenu'
import { useAuthContext } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export default function DashboardPage(props) {

    const [userDetails, setUserDetails] = useState({
        firstName: "Wanderer",
        lastName: "King",
        balance: 200
    });

    const {token} = useAuthContext();
    const {userId} = jwtDecode(token);

    useEffect(() => {
        
        axios.get('https://dummy-payment-platform.vercel.app/api/v1/user/dashboard?userId='+userId)
        .then(res => {
            setUserDetails(res.data);
        })
    }, [])



    return( 
    <div>
        {/* Top Bar */}
        <div className='flex justify-between border-b-4 pt-2 px-2 shadow-lg '>
            <div className="flex flex-col justify-center pl-3">{userDetails.firstName}'s dashboard page</div>
            <div className='flex justify-evenly m-1'>
                <div className='flex flex-col justify-center px-4 h-full'>Hello</div>
                <DashboardDropdownMenu User={userDetails} />
            </div>   
        </div>

        {/* Balance display component */}
        <BalanceDisplay User={userDetails} />

        {/* Users List Component */}
        <UsersList fromUser={userDetails}/>

    </div>
)}