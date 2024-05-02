import React from 'react'
import BalanceDisplay from './buildingblocks/BalanceDisplay'
import UsersList from './buildingblocks/UsersList'

export default function DashboardPage(props) {

    return( 
    <div>
        {/* Top Bar */}
        <div className='flex justify-between border-b-4 pt-2 px-2 shadow-lg '>
            <div className='flex flex-col justify-center'>this is the dashboard page</div>
            <div className='flex justify-evenly m-1'>
                <div className='flex flex-col justify-center px-4 h-full'>Hello</div>
                <div className='flex justify-center border-black rounded-full bg-slate-400 p-2 h-12 w-12'>
                    <div className='flex flex-col justify-center h-full text-xl'>U</div>
                </div>
            </div>   
        </div>

        {/* Balance display component */}
        <BalanceDisplay />

        {/* Users List Component */}
        <UsersList />

    </div>
)}