import React, { useState, useEffect, useRef } from 'react'
import Button from './Button';
import InputBox from './InputBox';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GenericDropDown from './GenericDropDown';
import FriendshipButton from './FriendshipButton';

export default function UsersList(props) {

    //declaring all hooks.
    const [users, setUsers] = useState(['Kim Dokja', 'Yoo Jonghyuk', 'Yoo Sangah']);
    const searchInputRef = useRef(null);
    const [searchedUsers, setSearchedUsers] = useState([...users]); //this is not exactly needed as the useEffect anyway sets them both to what db gives back.
    const [foundUsers, setFoundUsers] = useState(true);
    const [friendsList, setFriendsList] = useState([]);
    const [frequentsList, setFrequentsList] = useState([]);

    const navigate = useNavigate();



    useEffect(() => {
        //getting all users
        axios.get("http://localhost:3000/api/v1/user/bulk")
        .then(response => {
            if (response) {
                let listOfUsers = [];
                for (let item of response.data.users) {
                    listOfUsers.push(item.firstName+' '+item.lastName);
                }
                setUsers(listOfUsers);
                setSearchedUsers(listOfUsers);
            } else {
                setFoundUsers(false);
            }
        });
        //getting all friends of current user
        axios.get('http://localhost:3000/api/v1/user/getfriends')
        .then(res => {
            let listOfFriends = [];
            for (let item of res.data.friends) {
                listOfFriends.push(item.firstName+' '+item.lastName);
            }
            setFriendsList(listOfFriends);
        });
        //getting all frequents of the current user (will complete this later)
        // axios.get('http://localhost:3000/api/v1/user/frequents')
        // .then(res => {
        //     console.log("FREQUENTS AXIOS RESPONSE", res);
        // })
    }, [])

    function handleSearchInput (e) {
        searchInputRef.current = e.target.value;
        setSearchedUsers(users.filter((val, i, arr) =>{
            const [fn, ln] = val.split(' ');
            return (
                fn.toLocaleLowerCase().includes(searchInputRef.current.toLocaleLowerCase()) || 
                ln.toLocaleLowerCase().includes(searchInputRef.current.toLocaleLowerCase()) || 
                searchInputRef.current ===""
            ) //filtering the whole list to only users whose first name (fn) or last name(ln) contains the searched query (searchInputRef.current)
        }));
    }

    function handleReload() {
        window.location.reload();
    }

    

    const currentUserFullName = props.fromUser.firstName+' '+props.fromUser.lastName;

    return(
        // full user list container
        <div className='px-6 ml-2'>
            <div className='font-semibold pb-4'>Send anyone money. You can add your friends to lists like 'favorites'. The 'frequents' list gets updated automatically. </div>

            {/* Search Bar with Icon */}
            <div className='flex justify-center'>

                <div className='flex'>
                    <div className='flex'>
                        {/* Icon */}
                        <div className='flex flex-col justify-end pb-1 pr-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        
                        {/* Search Bar */}
                        <InputBox label={""} placeholder={"Search Users..."} onChange={handleSearchInput} type="text" name="searchBar" />
                    </div>
                    
                    {/* Dropdown */}
                    <div className='flex flex-col justify-end px-2'><GenericDropDown setSearchedUsers={setSearchedUsers} allUsers={users} friendsList={friendsList} setFriendsList={setFriendsList}/></div>
                    
                    {/* Reload Button */}
                    <div className='flex flex-col justify-end px-1 py-2' onClick={handleReload}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:text-green-500 hover:shadow-lg rounded-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </div>

                </div>

            </div>

            {/* User list */}
            <div>
                { foundUsers ?  
                    searchedUsers
                    .filter((val)=>{return val !== currentUserFullName}) //so that you don't see your own name on the list. 
                    .map(user => {
                        return (
                        <div key={user} className='flex justify-center w-full'>
                            <div className='text-sm md:text-base flex justify-between shadow-sm md:w-4/5 w-full hover:shadow-lg rounded-lg hover:font-bold'> 
                                <div className='flex flex-col justify-center md:justify-end pl-1 '>
                                    {user}
                                </div>

                                <div className='flex flex-col justify-center'>
                                    {/* Buttons */}
                                    <div className='flex text-xs'>
                                        <div className='px-2'>
                                            <Button className="text-xs" label={"Send Money"} onClick={() => navigate('/send', {state: {toUser: user}})} />
                                        </div>
                                        <div>
                                            <FriendshipButton user={user} friendsList={friendsList}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}) :
                    <div>An error occured when finding users. Please refresh the page and try again. </div>
                }
            </div>

        </div>
)}