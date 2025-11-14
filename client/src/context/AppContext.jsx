import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export function AppContextProvider({children}) {
    const currency = import.meta.VITE_CURRENCY;

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})

    // Fetch all products
    const fetchProducts = async() => {
        setProducts(dummyProducts)
    }

// Add product to cart
const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId]
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

    useEffect(() => {
        fetchProducts()
    }, [])

    const value = {navigate, user, setUser, setIsSeller, isSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItems}
    return (<AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>)
}

export function useAppContext(){
    return (useContext(AppContext))
}