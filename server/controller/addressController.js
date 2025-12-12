// Add Address: /api/address/add

import Address from "../models/Address.js"

export const addAddress = async(req, res) => {
    try{
        const {address} = req.body
        // authUser middleware sets req.userId from the JWT
        const userId = req.userId
        await Address.create({...address, userId})
        res.json({success: true, message: "address added successfully"})
    } catch(error){
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}


// get address: /api/address/get
export const getAddress = async(req, res) => {
    try {
        const userId = req.userId
        const addresses = await Address.find({userId})
        res.json({success: true, addresses})
    } catch(error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}