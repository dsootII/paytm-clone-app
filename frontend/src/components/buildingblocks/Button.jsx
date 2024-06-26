import React from 'react'


export default function Button({label, onClick}) {
    return <button 
    onClick={onClick} 
    type="button" 
    className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 text-xs md:text-sm font-medium rounded-lg px-5 py-2.5 mt-5 hover:shadow-lg hover:text-green-400"
    >
        {label}
    </button>
}