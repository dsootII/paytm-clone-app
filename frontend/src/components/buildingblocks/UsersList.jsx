import React, { useState } from 'react'
import Button from './Button';
import InputBox from './InputBox';

export default function UsersList(props) {

    const [users, setUsers] = useState(['Kim Dokja', 'Yoo Jonghyuk', 'Yoo Sangah']);


    return(
        <div className='p-6 ml-2'>
            <div className='font-semibold'>Users</div>

            <div>
                <InputBox label={""} placeholder={"Search Users..."} />
            </div>


            <div>
                {users.map(user => {
                    return <div key={user} className='flex justify-between border-b shadow-sm'> 
                        <div className='flex flex-col justify-end'>
                            {user}
                        </div>
                        <div className='flex flex-col justify-center'>
                            <Button label={"Send Money"} onClick={() => alert('send money button clicked')} />
                        </div>
                    </div>
                })}
            </div>

        </div>
)}