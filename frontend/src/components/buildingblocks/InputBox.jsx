import React from 'react'

export default function InputBox({label, placeholder}) {

    return <div>
        <div className="text-sm font-medium text-left py-2.5">
        {label}
      </div>
      <input placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200" />
    </div>
}