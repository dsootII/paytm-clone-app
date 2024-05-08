import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import {jwtDecode} from "jwt-decode"
import {BarLoader} from "react-spinners"
import { useAuthContext } from '../context/AuthContext';


export default function SendMoneyPage(props) {

    const location = useLocation();
    const {toUser} = location.state; //fromUser is an obj {firstName, lastName, balance}, toUser is a string "<firstName> <lastName>"
    const [transferAmount, setTransferAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {token} = useAuthContext();

    function handleTransfer() {
        const fromUserDetails = jwtDecode(token);
        const fromUserId = fromUserDetails.userId;
        setIsLoading(true);
        //we need db ids of both fromUser and toUser. we have the fromUser above. we need the toUser. 
        axios.get("http://localhost:3000/api/v1/user/bulk?fullName="+toUser)
        .then(response=>{
            console.log("receiver's id recieved at frontend:", response.data.users[0]._id);
            const toUserId = response.data.users[0]._id;
            axios.post("http://localhost:3000/api/v1/account/transfer", {
                userId: fromUserId,
                to: toUserId,
                amount: transferAmount
            })
            .then(async (resp) => {
                console.log("post transfer response:\n", resp);
                setTimeout(() => {
                    alert('Transfer finished successfully! You will now be taken back to dashboard.')
                    navigate("/dashboard");
                }, 3000);
                
            })
        }).catch(e => console.error(e))


    }


    return <div className="flex justify-center h-screen bg-gray-100">
    <div className="h-full flex flex-col justify-center">
        <div
            className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg"
        >
            <div className="flex flex-col space-y-1.5 p-4">
            <h2 className="text-3xl font-bold text-center">Send money to</h2>
            </div>
            <div className="p-6">
            <div className="flex items-center space-x-4 pb-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">{toUser[0].toUpperCase()}</span>
                </div>
                <h3 className="text-2xl font-semibold">{toUser}</h3>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 px-2"
                    htmlFor="amount"
                >
                    Amount (in Rs)
                </label>
                <input
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    id="amount"
                    placeholder="Enter amount"
                    value={transferAmount}
                    onChange={(e)=>setTransferAmount(e.target.value)}
                />
                </div>
                { isLoading ? 
                 <div className='flex justify-center' >
                    <BarLoader color="#98ff98" loading={isLoading}  />
                 </div>
                 :
                 <button 
                 className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white hover:text-green-500 hover:bg-white hover:border-2 hover:border-green-500 hover:shadow-lg active:shadow-2xl" 
                 onClick={handleTransfer}
                 >
                     Initiate Transfer
                 </button>
                }
            </div>
            
            </div>
    </div>
  </div>
</div>
}