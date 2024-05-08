import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function TransactionsPage(props) {

    const {token} = useAuthContext();
    const {userId} = jwtDecode(token);
    const [transactions, setTransactions] = useState([]);
    
    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/user/transactions?userId="+userId)
        .then(res => {
            console.log(res.data.transactions);
            setTransactions(res.data.transactions);
        })
    }, [])

    return<div>
        <div>
            Someone's Transactions:
        </div>
        <div>
            {transactions.map(transaction => {
                return (
                <div key={transaction.receiver}>{transaction}</div>
            )})
            }
        </div>
    </div>
}