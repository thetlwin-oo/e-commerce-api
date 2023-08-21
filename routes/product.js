

const express = require("express")
const router = express.Router();
const Product = require("../modles/Products.js")
const { verifyTokenAuthorizaiton,verifyTokenAdmin } = require("./verifyToken")


router.post('/',verifyTokenAdmin,async (req,res)=>{
    const newProduct = new Product(req.body)

    try{
        const saveProducts = await newProduct.save()
        res.status(200).json(saveProducts)

    }catch(err){
        res.status(500).json(err)
    }
})

//update
router.put('/:id',verifyTokenAdmin,async (req,res)=>{ 
    try{
        const updateProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set : req.body
        },{new : true})
        res.status(200).json(updateProduct)
    }catch(err){
        res.status(500).json(err)
    }
})

//delete

router.delete('/:id',verifyTokenAdmin,async (req,res)=>{
   try{
       await Product.findByIdAndDelete(req.params.id)
       res.status(200).json("Product has been deleted")
   }catch(err){
        res.status(500).json(err)
   }
})

//getUser

router.get('/:id',verifyTokenAdmin,async (req,res)=>{
    try{
       const OneProduct = await Product.findById(req.params.id)
       res.status(200).json(OneProduct)

    }catch(err){
         res.status(500).json(err)
    }
 })

//AllgetUser

router.get('/',verifyTokenAdmin,async (req,res)=>{
    const qNew = req.query.new
    const qCategory = req.query.category
    try{
        let products;

       if(qNew){
        products = await Product.find().sort({ createdAt : -1 }).limit(1)
       }else if(qCategory){
        products = await Product.find({
            categories : {
                $in : [qCategory]
            }
        })
       } else {
        products = await Product.find()
       }
       res.status(200).json(products)

    }catch(err){
         res.status(500).json(err)
    }
 })

module.exports = router;