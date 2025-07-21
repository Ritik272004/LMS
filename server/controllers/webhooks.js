import {Webhook} from "svix";
import User from "../models/user.js"
import Stripe from "stripe";
import {Purchase}  from "../models/Purchase.js";
import Course from "../models/Course.js";

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

// Setup Stripe Webhook to verify payment
// http://docs.stripe.com/webooks(Go-to :Home/Developer resource/Event destination/webhook endpoint) : Use this documentation to create stripe webook 


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async (request,response)=>{
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

   // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.create.list({
        payment_intent : paymentIntentId
      })
      const {purchaseId} = session.data[0].metadata

      const purchaseData = await Purchase.findById(purchaseId)

      const userData = await User.findById(purchaseData.userId)

      const courseData = await Course.findById(purchaseData.courseId.toString())

      courseData.enrolledStudents.push(userData)
      await courseData.save()

      userData.enrolledCourses.push(courseData._id)
      await userData.save()

      purchaseData.status = 'completed'
      await purchaseData.save()

     break; 
    }
         
    case 'payment_method.attached':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.create.list({
        payment_intent : paymentIntentId
      })
      const {purchaseId} = session.data[0].metadata

      const purchaseData = await Purchase.findById(purchaseId)

      purchaseData.status = 'failed'
      await purchaseData.save()

      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});

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

http://docs.stripe.com/webooks : Use this documentation to create stripe webook 



 */

  
   