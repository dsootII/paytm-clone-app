import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
  } from "@material-tailwind/react";

export default function TransactionsPage(props) {

    const {token} = useAuthContext();
    const {userId} = jwtDecode(token);
    const [sentTransactions, setSentTransactions] = useState([]);
    const [receivedTransactions, setReceivedTransactions] = useState([]);
    const location = useLocation();
    const userDetails = location.state;
    const navigate = useNavigate();
    
    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/user/transactions?userId="+userId)
        .then(res => {
            setSentTransactions(res.data.sent_transactions);
            setReceivedTransactions(res.data.received_transactions);
        }).catch(err => console.error(err));
    }, [])

    return(
        <div className="container mx-auto py-8">
            <div className="text-center mb-4">
                <h1 className="text-2xl font-semibold pb-2">{userDetails.firstName}'s transactions</h1>
                <button className="text-gray-500 p-3 border rounded-lg shadow-sm hover:shadow-lg" onClick={() =>navigate('/dashboard')}>Go back to Dashboard</button>
            </div>

            <div className="flex justify-center">
                <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 px-1">
                    <Tabs value="Sent">
                        <TabsHeader>
                            <Tab value="Sent" className="text-red-500 hover:bg-red-300 rounded-md hover:shadow-md">Sent</Tab>
                            <Tab value="Received" className="text-green-500 hover:bg-green-300 rounded-md hover:shadow-md">Received</Tab>
                        </TabsHeader>
                        <TabsBody>
                            <TabPanel value="Sent">
                                {sentTransactions.map(transaction => (
                                    <div key={transaction._id} className="border-b py-2">
                                        <p><strong>{transaction.amount}</strong> to <strong>{transaction.receiver.firstName} {transaction.receiver.lastName}</strong> on {transaction.created_at ? transaction.created_at.split('T')[0] : "an unspecified date"}</p>
                                    </div>
                                ))}
                            </TabPanel>
                            <TabPanel value="Received">
                                {receivedTransactions.map(transaction => (
                                    <div key={transaction._id} className="border-b py-2">
                                        <p><strong>{transaction.amount}</strong> from {transaction.sender.firstName} {transaction.sender.lastName} on {transaction.created_at ? transaction.created_at.split('T')[0] : "an unspecified date"}</p>
                                    </div>
                                ))}
                            </TabPanel>
                        </TabsBody>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}