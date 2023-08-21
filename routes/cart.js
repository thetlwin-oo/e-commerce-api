



const express = require("express")
const router = express.Router();
const Cart = require("../modles/Cart.js")
const { verifyTokenAuthorizaiton,verifyTokenAdmin } = require("./verifyToken")


router.post('/',verifyTokenAuthorizaiton,async (req,res)=>{
    const newCart = new Cart(req.body)
    try{
        const saveCart = await newCart.save()
        res.status(200).json(saveCart)

    }catch(err){
        res.status(500).json(err)
    }
})

//update
router.put('/:id',verifyTokenAuthorizaiton,async (req,res)=>{ 
    try{
        const updateCart = await Cart.findByIdAndUpdate(req.params.id,{
            $set : req.body
        },{new : true})
        res.status(200).json(updateCart)
    }catch(err){
        res.status(500).json(err)
    }
})

//delete

router.delete('/delete/:id',verifyTokenAuthorizaiton,async (req,res)=>{
   try{
       await Cart.findByIdAndDelete(req.params.id)
       res.status(200).json("Product has been deleted")
   }catch(err){
        res.status(500).json(err)
   }
})

//getUser

router.get('/find/:userId',verifyTokenAuthorizaiton,async (req,res)=>{
    try{
       const oneCart = await Cart.findOne({ userId : req.params.userId })
       res.status(200).json(oneCart)
    }catch(err){
         res.status(500).json(err)
    }
 })

//AllgetUser

router.get("/",verifyTokenAdmin,async (req,res) => {
    try{
        const getAllCart = await Cart.find()
        res.status(200).json(getAllCart)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;