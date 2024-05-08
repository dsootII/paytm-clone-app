import React, { useEffect, useState } from 'react'

export default function BalanceDisplay(props) {

    function formatBalance (amount) {
        const reversedAmount = amount.toString().split("").reduce((acc, char) => char + acc, "");
        let formattedReverse = '';
        for (let i=0; i<reversedAmount.length; i++) {
            formattedReverse += reversedAmount[i];
            if (i !== 0 && i%2 === 0 && i !== reversedAmount.length-1) {
                formattedReverse += ',';
            }
        }
        const formattedAmount = formattedReverse.split("").reduce((acc, char) => char + acc, "");
        return formattedAmount
    }



    return(
        <div className='p-6 ml-2 flex'>
            <div className='flex border-2 px-4 py-2' onClick={()=>alert('yes you can click on this div')}>
                <div className='font-semibold px-2'>Your balance is:</div> <div className='font-bold'> Rs {formatBalance(Math.round(props.User.balance))} </div>
            </div>
        </div>
)}