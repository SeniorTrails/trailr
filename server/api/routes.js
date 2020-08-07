//import express framework 
const {Router} = require('express');

//set local variable to  a new instance of express router 
const router = Router();

//route handlers 
router.get('/', (req, res, next)=>{
res.send("Hello World")
})

module.exports = {
  router,
}