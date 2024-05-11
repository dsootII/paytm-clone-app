import React, { useEffect, useState } from 'react'
import Button from './Button'
import axios from 'axios';

export default function FriendshipButton({user, friendsList}) {
    //user is the person jiske against ye button aayega, NOT the current user, as in, NOT the person jiska dashboard hai
    //friendsList is jiska dashboard hai uska list of friends
    //check if user is in friends list, if so, set label as "Unfriend", else set it as "Befriend"
    //based on the same condition above, we can pass a different onClick function. One for unfriending, on for befriending, respectively. 

    const [label, setLabel] = useState(friendsList.includes(user) ? 'Unfriend' : 'Befriend');

    useEffect(() => {
        setLabel(friendsList.includes(user) ? 'Unfriend' : 'Befriend')
    }, [friendsList]);



    

    function handleBefriending(user) {
        //user - '<fn> <ln>'
        const [fn, ln] = user.split(' ');
        if (user == "Luffy D. Monkey") {
            axios.post("https://dummy-payment-platform.vercel.app/api/v1/user/setfriend", {firstName: "Luffy", lastName: "D. Monkey"})
            .then(res => {
                setLabel('Unfriend');
            })

        } else {
            axios.post('https://dummy-payment-platform.vercel.app/api/v1/user/setfriend', {firstName:fn, lastName: ln})
            .then(res => {
                setLabel('Unfriend');
            })
        }
    }

    function handleUnfriending(user) {
        const [fn, ln] = user.split(' ');
        if (user == "Luffy D. Monkey") {
            axios.post("https://dummy-payment-platform.vercel.app/api/v1/user/unfriend", {firstName: "Luffy", lastName: "D. Monkey"})
            .then(res => {
                setLabel('Befriend');
            })

        } else {
            axios.post('https://dummy-payment-platform.vercel.app/api/v1/user/unfriend', {firstName:fn, lastName: ln})
            .then(res => {
                setLabel('Befriend');
            })
        }
    }


    return <div>
        <Button label={label} onClick={label==='Befriend' ? () => handleBefriending(user) : () => handleUnfriending(user)}/>
        </div>
}