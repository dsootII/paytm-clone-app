import React, { useState } from 'react'

export default function BalanceDisplay(props) {

    const [balance, setBalance] = useState(10000);

    function formatBalance(amount){
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
        <div className='p-4 ml-2 flex'>
            <div className='font-semibold px-2'>Your balance is:</div> <div className='font-bold'> Rs {formatBalance(balance)} </div>
        </div>
)}