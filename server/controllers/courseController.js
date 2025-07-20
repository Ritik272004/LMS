
import Course from "../models/Course.js"

// Get All Courses


export const getAllCourse = async (req,res)=>{
    try {
        const courses = await Course.find({
            isPublished:true // This fetch all course documents from database where isPublished is true
        }).select(['-courseContent' , '-enrolledStudents']).populate({path:'educator'}) // .select([-...]) excludes the fields courseContent and enrolledStudents from the result
        // .populate({...}) it replaces educator field(which is ID reference to User collection) with actual user document . It bring all fields of educator unless you specify  .populate({path : 'educator , select: 'name imageUrl'})
        res.json({
            success:true,
            courses
        })

    } catch (error) {
        res.json({
            success:false,
            message:error.message        
        })
    }
}

// Get Course by Id

export const getCourseId = async (req,res)=>{
    const {id}  = req.params
    try {
        const courseData = await Course.findById(id).populate({path:'educator'})

        // Remove lectuerUrl if isPreviewFree is false

        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl = "";
                }
            })
        })
        res.json({
            success:true,
            courseData
        })

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}