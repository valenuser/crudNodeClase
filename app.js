const express = require('express')

const app =  express()

const morgan = require('morgan')


app.use(morgan('dev'))

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/',require('./routes/main'))



let port = process.env.PORT || 3000
app.listen(port, (req,res)=>{
    console.log(`server running on port ${port}`);
})