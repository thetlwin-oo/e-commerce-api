



const express = require("express")
const router = express.Router();
const Order = require("../modles/Orders.js")
const { verifyTokenAuthorizaiton,verifyTokenAdmin } = require("./verifyToken")


router.post('/',verifyTokenAuthorizaiton,async (req,res)=>{
    const newOrder = new Order(req.body)
    try{
        const saveOrder = await newOrder.save()
        res.status(200).json(saveOrder)

    }catch(err){
        res.status(500).json(err)
    }
})

//update
router.put('/:id',verifyTokenAuthorizaiton,async (req,res)=>{ 
    try{
        const updateOrder = await Order.findByIdAndUpdate(req.params.id,{
            $set : req.body
        },{new : true})
        res.status(200).json(updateOrder)
    }catch(err){
        res.status(500).json(err)
    }
})

//delete

router.delete('/:id',verifyTokenAuthorizaiton,async (req,res)=>{
   try{
       await Order.findByIdAndDelete(req.params.id)
       res.status(200).json("Order has been deleted")
   }catch(err){
        res.status(500).json(err)
   }
})

//getOrder

router.get('/find/:userId',verifyTokenAdmin,async (req,res)=>{
    try{
       const getOrder = await Order.find({ userId : req.params.userId })
       res.status(200).json(getOrder)
    }catch(err){
         res.status(500).json(err)
    }
 })

//AllgetOrder

router.get("/",verifyTokenAdmin,async (req,res) => {
    try{
        const getAllOrder = await Order.find()
        res.status(200).json(getAllOrder)
    }catch(err){
        res.status(500).json(err)
    }
})

router.get("/income",verifyTokenAdmin,async (req,res) => {
    const date = new Date(); 
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1 ))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1 ))

    try {
        const income = await Order.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;

