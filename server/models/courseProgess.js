import mongoose from 'mongoose'

const courseProgressSchema = new mongoose.Schema({
    userId : {type: String , required:true},
    courseId : {type: String , required:true},
    completed : {type: boolean , default : false},
    lectureCompleted : []
} , {minimize:false})// with minimize false mongoDB doesn't remove empty object while saving document.

export const CourseProgress = mongoose.model('CourseProgress' , courseProgressSchema)