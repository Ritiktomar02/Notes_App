import React, { useState } from 'react'
import { FaRegEye,FaRegEyeSlash} from "react-icons/fa";
const PasswordInput = ({value,onChange,placeholder}) => {

  console.log(value," ",onChange," ",placeholder);

    const [isshowpassword,setisshowpassword]=useState(false);

    const togglepassword=()=>{
        setisshowpassword(!isshowpassword);
    }
  return (
    <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
      <input
      value={value}
      onChange={onChange}
      type={isshowpassword?'password':'text'}
      placeholder={placeholder || "Password"}
      className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
      />

      {
        isshowpassword?(
            <FaRegEye className='text-[#2B85FF] cursor-pointer'
            size={22}
            onClick={()=>(togglepassword())}/>
        ):(
            <FaRegEyeSlash className='text-slate-400 cursor-pointer'
            size={22}
            onClick={()=>(togglepassword())}/>
        )
      }
    </div>
  )
}

export default PasswordInput
