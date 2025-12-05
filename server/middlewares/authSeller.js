import jwt from 'jsonwebtoken'

export const authSeller = async(req, res, next) => {
    const {sellerToken} = req.cookies;
    if(!sellerToken){
        return res.json({success: false, message: 'Not Authorized'})
    }

     try {
            const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
            if(tokenDecode.email === process.env.SELLER_EMAIL){
                req.body.userId = tokenDecode.id;
            }else {
                return res.json({success: false, message: "Not authorized"})
            }
            next();
        } catch(error) {
            res.json({success: false, message: error.message})
        }
}