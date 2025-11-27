import React from 'react'
import Navbar from "../src/components/Navbar"
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/login'
import Products from './pages/Products'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import SellerLogin from './components/seller/sellerlogin'

export default function App(){
  const isSellerPath = useLocation().pathname.includes("seller")
  const {showUserLogin, isSeller} = useAppContext()
  return (<div>

    {isSellerPath? null : <Navbar/>}
    {showUserLogin? <Login/> : null}

    <Toaster/>
    <div className={`${isSellerPath? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/products' element={<Products/>}></Route>
        <Route path='/products/:category' element={<ProductCategory/>}/>
        <Route path='/products/:category/:id' element={<ProductDetails/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/add-address' element={<AddAddress/>}/>
        <Route path='/my-orders' element={<MyOrders/>}/>
        <Route path='/seller' element={isSeller? null : <SellerLogin/>}/>
      </Routes>
    </div>
    {!isSellerPath && <Footer/>}
  </div>)
}