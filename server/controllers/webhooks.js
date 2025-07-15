import {Webhook} from "svix";
import User from "../models/user.js"

// API Controller Function to manage clerk user with database.

export const clerkWebhooks = async(req,res)=>{
    try {
       const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
       await whook.verify(JSON.stringify(req.body) , {
        "svix-id" : req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature" : req.headers["svix-signature"]
       })

       const {data , type} = req.body;

       switch(type){
          case 'user.created' : {
                const userData = {
                    _id: data.id,
                    email:data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
            }
            await User.create(userData)
            res.json({})
            break;
          }

          case 'user.updated' : {
              const userData = {
                email:data.email_addresses[0].email_address,
                name:data.fisrt_name + " " + data.last_name,
                imageUrl : data.imageUrl,
            }
            await User.findByIdAndUpdate(data.id , userData)
            res.json({})
            break;
          }
          
          case 'user.deleted' : {
            await User.findByIdAndDelete(data.id)
            res.json({})
            break;
          }

          default :
            break;
       }
    } 
    catch (error) {
        res.json({success:false , message:error.message})
    }
}

/*
Webhook is a way for one server(like clerk) to send real-time data to another server(like your backend) , when an event occurs like user being created , updated , deleted.
svix is library used to verify the authenticity of webhook(clerk uses svix under the hood to send webhooks)
User is Mongoose model to store user data in MongoDB database.
CLERK_WEBHOOK_SECRET is secret key (from clerk Dashboard) that ensure only clerk an send valid data to my server.
const headers = {
  "svix-id": req.headers["svix-id"],
  "svix-timestamp": req.headers["svix-timestamp"],
  "svix-signature": req.headers["svix-signature"],
};
These headers are automatically added by Clerk. They’re needed for Svix to validate the webhook.

Actually what happen :
clerk uses Svix under the hood to send webhooks.
When clerk sends you a Webhook , svix digitally sign the payload using a secret key(Your CLERK_WEBHOOK_SECRET)
Your server uses these headers and secret key to verify that the request really came from clerk not from hacker or fake bot.
This process is called signature verification.

clerk is user authentication and management service designed for modern web .
It helps you to add login , signup and user profile features to your app without building everything from scratch. 
 */