import React from 'react'
import { SiConvertio } from "react-icons/si";
const Navbar = () => {
  return (
    <div className='h-16 bg-rose-300/80 flex items-center'>
      <div className="logo ml-4 pr-4 text-3xl">
        <SiConvertio />
      </div>
      <div className="header text-zinc-800 text-3xl">
        Convertify
      </div>
    </div>
  )
}

export default Navbar
