

const adminauth = (req,res,next)=>{

    isadmin = true
    if(!isadmin){
        res.status(401).send("not authorized")
    }
    else{
        next()
    }


}

module.exports={
    adminauth,
}