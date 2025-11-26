import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'

export default function SellerLogin(){
    const {isSeller, setIsSeller, navigate} = useAppContext()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const onSubmitHandler = async(event) => {
        event.preventDefault()
        setIsSeller(true)
    }

    useEffect(() => {
        if(isSeller){
            navigate("/seller")
        }
    }, [isSeller])
    
    return !isSeller && (
        <form onSubmit={onSubmitHandler}></form>
    )
}