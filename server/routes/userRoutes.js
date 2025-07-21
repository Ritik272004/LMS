import express from'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateCourseProgess, userEnrolledCourses } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',userEnrolledCourses)
userRouter.post('/purchase',purchaseCourse) // Stripe’s official documentation also suggests using POST for creating checkout sessions or processing payments. Sensitive data like (tokens , price Info) should not be passed in a URL(which happens thorugh get) , always use post method for this.
userRouter.post('/update-course-progress' , updateCourseProgess)
userRouter.post('/get-course-progress' , getUserCourseProgress)
userRouter.post('/add-rating' , addUserRating)



export default userRouter; 