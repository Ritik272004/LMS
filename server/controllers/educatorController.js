import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
import { Purchase } from '../models/Purchase.js'
import User from '../models/user.js'

export const updateRoleToEducator = async(req, res)=>{
    try {
        const userId = req.auth.userId
        await clerkClient.users.updateUserMetadata(userId , {
            publicMetadata : {
                role : 'educator',
            }
        })
        res.json({success : true , message: 'You can publish a course now'})
    } catch (error) {
        res.json({success : false  , message : error.message })
    }
} 

// Add New Course

export const addCourse = async(req,res)=>{
    try {
        // console.log("File" , req.file); req.file is object that store uploaded file data(like fieldname , mimeType , size , path )
        // console.log("Body" , req.body); req.body is object that store courseData as property
        const {courseData} = req.body // store text type data
        const imageFile = req.file // store image , pdf etc
        const educatorId = req.auth.userId

        if(!imageFile){
           return res.json({success:false , message:'Thumbnail Not Attached'})
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.CourseThumbnail = imageUpload.secure_url

        await newCourse.save()

        res.json({success:true , message:'Course added'})


    } catch (error) {
       res.json({success:false , message:error.message})
    }
} 

// Get Educator courses

export const getEducatorCourses = async (req,res)=>{
    try {
        const educator = req.auth.userId

    const courses = await Course.find({educator})
    res.json({success:true , courses})
    } catch (error) {
        res.json({success:false , message: error.message})
    }
}

// Get Educator Dashboard Data (Total Earnings , Enrolled Students , No. of Courses)

export const educatorDashboardData = async(req,res)=>{
    try {
       
        const educator = req.auth.userId

        const courses = await Course.find({educator})
        
        const totalCourses = courses.length;

        const courseIds = courses.map((course)=> { // This create an array of all Course IDs.
            return course._id
    })

        // Calculate Total Earning from purchases
        const purchases = await Purchase.find({ // Purchase.find({...}) is a MongoDB Query that searches in the Purchase Collection . It finds all purchases where:
            courseId : {$in: courseIds}, // The courseId is in the list of courseIds , using MongoDB operator $in
            status:'completed' // The status is completed
        })

        const totalEarnings = purchases.reduce((sum,purchase)=> sum + purchase.amount , 0) // It uses .reduce() to add the amount from each purchase object . sum is the accumulator , starting from 0

        // calculate unique enrolled student IDs with their course Title

        const enrolledStudentsData = []
        for(const course of courses){ // for each course find the user(students) who are enrolled in it.
            const students = await User.find({ // User.find({...}) is a MongoDB query that searches in User collection and 
                _id : {$in:course.enrolledStudents} // find users whose id's is in course.enrolledStudents(which is an array of user ids)
            } , 'name imageUrl'); // only return name and imageUrl(Url of user profile image)
        
        students.forEach(student=>{ // for every student retrieve from DB:
            enrolledStudentsData.push({ // push a new object to enrolledStudentsData that invcludes
                courseTitle : course.courseTitle, // courseTitle(so we know which course the student is from)
                student // student basic data(name , imageUrl)
            })
        })
    }

    res.json({
        success:true,
        dashboardData : {
            totalEarnings , enrolledStudentsData , totalCourses
        }
    })
    

    } catch (error) {
        res.json({
            success:false ,
            messsage:error.message
        })
    }
}


// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req,res)=>{
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator}) // store list of courses created by this educator
        const courseIds = courses.map(course => course._id); // list of all ids(course Ids) of educator courses

        // purchases with user and course data
    const purchases = await Purchase.find({
        courseId : {$in : courseIds},
        status : 'completed'
    }).populate('userId','name imageUrl').populate('courseId', 'courseTitle') // .populate() method fills in referenced data from related collections
    // userId : fetches the name and imageUrl of the student who purchased the course
    // courseId : fetches the courseTitle of the course that was purchased

    const enrolledStudents = purchases.map(purchase => ({ // You're creating a completely new object, based on selected properties from the original purchase.The original array purchases remains unchanged and intact.
        student : purchase.userId,
        courseTitle : purchase.courseId.courseTitle,
        purchaseDate : purchase.createdAt
    }))

    res.json({
        success:true,
        enrolledStudents
    })

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

/*
updateRoleToEducator Function update user's public metadata in clerk . set their role to educator ( Once it is done user is consider as educator in your app(eg: allowed to publish courses) )

clerkClient is used to programmatically interact with clerk from your backend.
Through clerkClient , you can read and update users metadata , sessions etc.

When you use clerk with your backend , clerk attach user authentication info with req.auth object.
req.auth.user_id is available only when you use clerk middleware(clerkMiddleware()) in your backend route.

 */