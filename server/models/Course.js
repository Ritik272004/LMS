import mongoose from 'mongoose'


const lectureSchema = new mongoose.Schema({
    lectureId: {type:String , required : true},
    lectureTitle:{type:String , required : true},
    lectureDuration:{type:Number , required:true},
    lectureUrl:{type:String , required:true},
    isPreviewFree: {type:String , required:true}, 
    lectureOrder:{type:Number , required : true},
},{_id:false})

const chapterSchema = new mongoose.Schema({
    chapterId: {type:String , required : true},
    chapterOrder:{type:Number , required : true},
    chapterTitle:{type:String , required : true},
    chapterContent:[lectureSchema]
},{_id:false}) // whenever new chapter is created it won't create id for this chapter because we already provided unique id from frontend using uniqid() package

const courseSchema = new mongoose.Schema({
    courseTitle:{type:String , required : true},
    courseDescription:{type:String , required : true},
    courseThumbnail:{type:String},
    coursePrice : {type:Number , required : true},
    isPublished : {type:Boolean , default : true},
    discount: {type:Number , required : true , min:0 , max:100},
    courseContent: [chapterSchema],
    courseRatings:[
        {
            userId : {type:String },
            rating : {type:String , min : 1 , max:5},
        }
    ],
    educator: {type:String , ref : 'User' , required : true},
    enrolledStudents:[
        {type:String , ref : 'User'},
    ]
} , {timestamps:true , minimize:false})

// Course Model to store course data in MongoDB database

const Course = mongoose.model('Course',courseSchema);

export default Course



/**
 * By default , mongoose remove empty objects from documents when saving
 * with {minimize:false} mongoose doesn't remove empty object while saving document.
 */