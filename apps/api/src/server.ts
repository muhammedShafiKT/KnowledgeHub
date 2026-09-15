import app from "./app.js"

const PORT = process.env.PORT 
app.listen(PORT,()=>{
    console.log("your server running on port 5000")
})