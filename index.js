const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mongoose = require('mongoose');
const cors = require('cors')
const authRouter = require("./routes/auth.js")
const userRouter = require("./routes/user.js")
const productRouter = require("./routes/product.js")
const cartRouter = require("./routes/cart.js")
const orderRouter = require("./routes/order.js")

dotenv.config()

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});


app.use(express.json())
app.use(cors())
app.use("/api/auth",authRouter)
app.use("/api/users",userRouter)
app.use("/api/products",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)



app.listen(process.env.PORT || 5000,()=> {
   console.log("server is running")
})

