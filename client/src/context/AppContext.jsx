import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export function AppContextProvider({children}) {
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState("")

// Fetch seller status
const fetchSeller = async() => {
        try{
            const {data} = await axios.get('/api/seller/is-auth')
            if(data.success){
                setIsSeller(true)
                // Clear user state when seller logs in (sellers don't have user tokens)
                setUser(null)
                setCartItems({})
                return true
            }else {
                setIsSeller(false)
                return false
            }
        } catch(error) {
            setIsSeller(false)
            return false
        }
    }

// Fetch user auth status
const fetchUser = async() => {
    // Don't fetch user if seller is already logged in
    if (isSeller) {
        setUser(null)
        return
    }
    
    try{
        const {data} = await axios.get('/api/user/is-auth')
        if (data.success){
            setUser(data.user)
            setCartItems(data.user.cartItems || {})
        }
    } catch(error){
        // Silently handle 401 errors (expected when not logged in as user)
        setUser(null)
        setCartItems({})
    }
}

// Fetch all products
const fetchProducts = async() => {
        try{
            const {data} = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch(error) {
                toast.error(error.message)
        }
    }

// Add product to cart
const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1
        }
        setCartItems(cartData)
        toast.success("Added to Cart")
    }

// Update Cart item quantity
const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData)
        toast.success("Cart Updated")
    }

// Remove Product from Cart
const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -= 1;
            if(cartData[itemId] === 0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from Cart")
        setCartItems(cartData)
    }
//get cart item count
const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems){
            totalCount += cartItems[item];
        }
        return totalCount;
    }

// get cart total amount
const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems){
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[items]
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        // Fetch seller status first, then conditionally fetch user
        const initializeAuth = async () => {
            const sellerStatus = await fetchSeller()
            // Only fetch user if not a seller (sellers don't have user tokens)
            if (!sellerStatus) {
                fetchUser()
            }
        }
        initializeAuth()
        fetchProducts()
    }, [])

    useEffect(() => {
        // Don't run during initialization
        if (isInitializing.current) {
            return;
        }

        // Early return: Don't update cart if seller is logged in or user is not logged in
        if (isSeller || !user) {
            return;
        }

        // Early return: Don't update cart if cartItems is empty
        if (!cartItems || Object.keys(cartItems).length === 0) {
            return;
        }

        const updateCart = async () => {
            try {
                const { data } = await axios.post('/api/cart/update', {cartItems})
                if(!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
                // Silently handle 401 errors (expected when not logged in as user or when seller is logged in)
                // Don't show toast for 401 errors as they're expected
                if (error.response?.status !== 401) {
                    toast.error(error.message)
                }
            }
        }

        updateCart()
    }, [cartItems, user, isSeller])

    const value = {navigate, user, setUser, setIsSeller, isSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts, setCartItems}
    return (<AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>)
}

export function useAppContext(){
    return (useContext(AppContext))
}