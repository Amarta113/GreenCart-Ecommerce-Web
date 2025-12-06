import express from 'express'
import authUser from '../middlewares/authUser'
import { addAddress, getAddress } from '../controller/addressController'

const addressRouter = express.Router()

addressRouter.post('/add', authUser, addAddress)
addressRouter.post('/get', authUser, getAddress)


export default addressRouter