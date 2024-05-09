import React, { useState, useEffect, useRef } from 'react'
import Button from './Button';
import InputBox from './InputBox';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GenericDropDown from './GenericDropDown';

export default function UsersList(props) {

    //declaring all hooks.
    const [users, setUsers] = useState(['Kim Dokja', 'Yoo Jonghyuk', 'Yoo Sangah']);
    const searchInputRef = useRef(null);
    const [searchedUsers, setSearchedUsers] = useState([...users]); //this is not exactly needed as the useEffect anyway sets them both to what db gives back.
    const [foundUsers, setFoundUsers] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
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
        })
    }, [])

    function handleSearchInput (e) {
        searchInputRef.current = e.target.value;
        console.log("value of searchInputRef inside the handleSearchInput", searchInputRef.current);
        setSearchedUsers(users.filter((val, i, arr) =>{
            const [fn, ln] = val.split(' ');
            return (
                fn.toLocaleLowerCase().includes(searchInputRef.current.toLocaleLowerCase()) || 
                ln.toLocaleLowerCase().includes(searchInputRef.current.toLocaleLowerCase()) || 
                searchInputRef.current ===""
            ) //filtering the whole list to only users whose first name (fn) or last name(ln) contains the searched query (searchInputRef.current)
        }));
    }

    const currentUserFullName = props.fromUser.firstName+' '+props.fromUser.lastName;
    console.log("value of searchInputRef inside the function code, ", searchInputRef.current);


    return(
        // full user list container
        <div className='px-6 ml-2'>
            <div className='font-semibold pb-4'>Send anyone money. You can add your friends to lists like 'favorites'. The 'frequents' list gets updated automatically. </div>

            {/* Search Bar with Icon */}
            <div className='flex justify-center'>

                <div className='flex'>
                    <div className='flex'>
                        <div className='flex flex-col justify-end pb-1 pr-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <InputBox label={""} placeholder={"Search Users..."} onChange={handleSearchInput} type="text" name="searchBar" />
                    </div>
                    <div className='flex flex-col justify-end px-2'><GenericDropDown /></div>
                    
                </div>

            </div>

            {/* User list */}
            <div>
                { foundUsers ?  
                    searchedUsers
                    .filter((val)=>{return val !== currentUserFullName}) //so that you don't see your own name on the list. 
                    .map(user => {
                        return (
                        <div key={user} className='flex justify-center'>
                            <div className='flex justify-between shadow-sm w-4/5'> 
                                <div className='flex flex-col justify-end'>
                                    {user}
                                </div>
                                <div className='flex flex-col justify-center'>
                                    <Button label={"Send Money"} onClick={() => navigate('/send', {state: {toUser: user}})} />
                                </div>
                            </div>
                        </div>
                    )}) :
                    <div>An error occured when finding users. Please refresh the page and try again. </div>
                }
            </div>

        </div>
)}