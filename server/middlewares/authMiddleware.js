/**
 * Middleware is a function that has access to request object(req) , response object(res) and next middleware function(next()) in the request-response cycle.
 * client-request -> Middleware 1 -> Middleware 2 -> route handler -> response sent
 * Middleware perform many tasks like :
 * logging requests , Authentication , validation , Handle errors , Modify req and res objects , pass control to next middleware function.
 * Types :
 * Application-level (app.use()) , Router-level (express.Router()) , Built-in (express.json()) , Error-handling(Has 4 parameters(err,req,res,next)) , Third-part(cors)
 * express.json() : Parse incoming json data in the request body and making it available on req.body
 * 
 */ 



import {clerkClient} from '@clerk/express'

// This Middleware can protect the educator route . So that only educator can upload courses.

export const protectEducator = async (req,res, next)=>{
    try {
        const userId = req.auth.userId
        const response = await clerkClient.users.getUser(userId)
        if(response.publicMetadata.role !== 'educator'){
            return res.json({success:false , message:'Unauthorized Access'})
        }
        next()
    } catch (error) {
        res.json({success:false , message : error.message})
    }
}
