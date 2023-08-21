const express = require("express")
const router = express.Router();
const User = require("../modles/User")
const CryptoJS = require("crypto-js");
const Jwt = require("jsonwebtoken")


router.post('/register',async (req,res)=>{
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString()
    })
    try{
        const saveUser = await newUser.save()
        res.status(200).json(saveUser)
      }catch(err){
          res.status(401).json(err)
      }
})

router.post('/login',async (req,res)=>{
    try{
        const user = await User.findOne({username : req.body.username})   
        !user && res.status(401).json("Wrong username")

        const hash = CryptoJS.AES.decrypt(user.password,process.env.PASS_SEC);
        const originalPassword = hash.toString(CryptoJS.enc.Utf8);
        
        originalPassword !== req.body.password && 
        res.status(401).json("Wrong password")

        const accessToken = Jwt.sign(
            {
                id : user._id,
                isAdmin : user.isAdmin 
            },
            process.env.JWT_SEC,
            {expiresIn : "3d"}
            )
        
        const {password,...others} = user._doc

        res.status(200).json( { ...others,accessToken })
      }catch(err){
          res.status(500).json(err)
      }
})






module.exports = router;