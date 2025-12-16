import jwt from 'jsonwebtoken'

export const authSeller = async(req, res, next) => {
    const {sellerToken} = req.cookies;
    
    // Debug logging (remove in production if needed)
    if (process.env.NODE_ENV !== 'production') {
        console.log('Auth Seller - Cookies:', req.cookies);
        console.log('Auth Seller - sellerToken exists:', !!sellerToken);
    }
    
    if(!sellerToken){
        return res.status(401).json({success: false, message: 'Not Authorized - No seller token found'})
    }

    try {
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
        
        // Check if JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables');
            return res.status(500).json({success: false, message: 'Server configuration error'})
        }
        
        // Check if SELLER_EMAIL is set
        if (!process.env.SELLER_EMAIL) {
            console.error('SELLER_EMAIL is not set in environment variables');
            return res.status(500).json({success: false, message: 'Server configuration error'})
        }
        
        if(tokenDecode.email === process.env.SELLER_EMAIL){
            next()
        }else {
            console.log('Token email mismatch:', tokenDecode.email, 'vs', process.env.SELLER_EMAIL);
            return res.status(401).json({success: false, message: "Not authorized - Invalid seller credentials"})
        }
    } catch(error) {
        console.error('JWT verification error:', error.message);
        return res.status(401).json({success: false, message: `Authentication failed: ${error.message}`})
    }
}