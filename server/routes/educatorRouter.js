/*
In Express.js:
Route define what endpoint to hit
Controller Function define what to do what that route is hit
express.Router() : used to create modular Route handlers means you separate different functionalities into different route files instead of writing everything in server.js file
eg: /routes/userRoutes.js
    /routes/courseRoutes.js

*/



import express from 'express'
import { addCourse, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator , educatorDashboardData } from '../controllers/educatorController.js'
import upload from '../configs/multer.js'
import { protectEducator } from '../middlewares/authMiddleware.js'

const educatorRouter = express.Router()

educatorRouter.get('/update-role' , updateRoleToEducator )
educatorRouter.post('/add-course',upload.single('imageFile'),protectEducator,addCourse)
educatorRouter.get('/courses' , protectEducator , getEducatorCourses)
educatorRouter.get('/dashboard', protectEducator , educatorDashboardData)
educatorRouter.get('/enrolled-students',protectEducator,getEnrolledStudentsData)

export default educatorRouter

/**
 * upload.single(fieldname) is used to handle single file uploads in express using multer
 * fieldname is the name of the input field in the frontend
 * This function parse incoming file , store in disk and attach to req.file 
 */