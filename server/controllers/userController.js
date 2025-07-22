import User from '../models/user.js'
import Course from '../models/Course.js'
import { Purchase } from '../models/Purchase.js';
import Stripe from 'stripe';
import { CourseProgress } from '../models/courseProgess.js';


// get user data
export const getUserData = async (req,res)=>{
    try {
       const userId = req.auth.userId;
       const user = await User.findById(userId)
    
       if(!user){
        return res.json({success: false , message: 'User Not Found'})
       }

       res.json({success:true , user})
       

    } catch (error) {
        res.json({success:false , message : error.message})
    }
}

// Users Enrolled Courses with Lecture Links

export const userEnrolledCourses = async (req,res)=>{
    try {
        const userId = req.auth.userId;
        const userData = await User.findById(userId).populate('enrolledCourses')

        res.json({success:true , enrolledCourses: userData.enrolledCourses
        })
    } catch (error) {
        res.json({success:false , message:error.message})
    }
}

// API Controller function to purchase any course

export const purchaseCourse = async (req,res)=>{
    try {
        const {courseId} = req.body;

        const {origin} = req.headers; 
        // The origin in req.headers.origin (in Expressjs) refers to origin of the request ie. the scheme + host + port from where HTTP request was initiated.
        // req.headers.origin is used in CORS(Cross origin Resource Sharing) checks and Creating stripe checkout sessions (e.g : for success_url , cancle_url).

        const userId = req.auth.userId;
        // console.log('UserID:', req.auth);

        const userData = await User.findById(userId) 
        
        const courseData = await Course.findById(courseId)

        if(!userData || !courseData){
            return res.json({success:false , message:'Data Not Found'})
        }

        const purchaseData = {
            courseId : courseData._id,
            userId,
            amount : (courseData.coursePrice - courseData.discount * courseData.coursePrice /100).toFixed(2), // toFixed(2) -> Converts number to a string with exactly 2 decimals(e.g: "3.10")
        }

        const newPurchase = await Purchase.create(purchaseData)

        // Initialize Stripe Payment Gateway

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        
        const currency = process.env.CURRENCY.toLowerCase();

        // Creating Line items for Stripe

        const line_items = [{
            price_data : {
                currency,
                product_data:{
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity : 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url : `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata : {
                purchaseId : newPurchase._id.toString()
            }
        })

        res.json({success:true , session_url : session.url})

    } catch (error) {
        res.json({success:false , message: error.message})
    }
}

// Update User Course Progress

export const updateCourseProgess = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const {courseId , lectureId} = req.body
        const progressData = await CourseProgress.findOne({userId , courseId}) // findOne() method finds the first progress document  where:/* userId matches the provided req.auth.userId, and courseId matches the one sent in req.body.*/ and it return only first single document not an array

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success:true , message : 'Lecture Already Completed'})
            }

        progressData.lectureCompleted.push(lectureId)
        await progressData.save()
        }

        else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted:[lectureId]
            })
        }
        res.json({success:true , message: 'Progress Updated'})
    } 
    catch (error) {
       res.json({success:false , message : error.message}) 
    }
}

// get User Course Progress

export const getUserCourseProgress = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const {courseId} = req.body
        const progressData = await CourseProgress.findOne({userId , courseId})
        res.json({success:true , progressData})
    } catch (error) {
        res.json({success:false , message : error.message})
    }
}

// Add User Ratings to Course

export const addUserRating = async (req,res)=>{
    const userId = req.auth.userId
    const {courseId , rating} = req.body

    if(!courseId || !userId || !rating || rating < 1 || rating > 5 ){
        return res.json({success:false , message : 'Invalid Details'})
    }
    try {
        const course = await Course.findById(courseId);

        if(!course){
            return res.json({success:false , message: 'Course Not Found.'})
        }

        const user = await User.findById(userId);

        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success:false , message: 'User has not purchased this course.'});          
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId); // findIndex(...) method searches in courseRating array and  return the index(position) of the first element that satisfy given condition ie. tha first rating given by specific user
           if(existingRatingIndex > -1){
                course.courseRatings[existingRatingIndex].rating = rating
           } else{
                course.courseRatings.push(userId , rating)
           }
        await course.save()

        return res.json({success:true , message: 'Rating Added'})

    } catch (error) {
       return res.json({success:false , message:error.message})
    }
}



/*
Stripe Payment Flow : 
1. User starts purchase
. User clicks "Buy Now" on your frontend
. Your Frontend calls:
    post /api/user/purchase
. Your backend create stripe checkout session and return with url .
. res.json({ session_url: session.url });

2. User redirect to Stripe checkout page
. Strioe handle payment UI securely.
. User fills in card details , and completes the payment.

3. Stripe redirects user to secure_url
You have configured this during session creation
success_url: `${origin}/loading/my-enrollments?session_id={CHECKOUT_SESSION_ID}`,

4. Stripe Calls Your Webhook Automatically
POST /stripe
with:
Headers like: stripe-signature
Raw JSON body with event data (e.g., payment_intent.succeeded)


*/
