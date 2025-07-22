import { createContext , useState , useEffect } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humaniseDuration from "humanise-duration"
import {useAuth , useUser} from "@clerk/clerk-react"
import axios from 'axios'
import { toast } from "react-toastify";


export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const currency = import.meta.env.VITE_CURRENCY

    const {getToken} = useAuth()
    const {user} = useUser()

    const [allCourses , setAllCourses] = useState([]);

    const [isEducator , setIsEducator] = useState(true);

    const [enrolledCourses , setEnrolledCourses] = useState([])

    // fetch all courses
    const fetchAllCourses = async ()=>{
        try {
         const {data} =  await axios.get(backendUrl + '/api/course/all');

         if(data.success){
            setAllCourses(data.courses)
         }else{
            toast.error(data.message)
         }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Fetch User Enrolled Courses

    const fetchUserEnrolledCourses = async ()=>{
        setEnrolledCourses(dummyCourses)
    }

     useEffect(()=>{
        fetchAllCourses();
        fetchUserEnrolledCourses();
    },[])

    const logToken= async ()=>{
        console.log(await getToken());
    }

    useEffect(()=>{
        if(user){
            logToken()
        }
    } , [user])

    const navigate = useNavigate();

    // function to calculate Average rating of course
    const calculateRating = (course) => {
        if(course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return totalRating/course.courseRatings.length;
    }

    // function to calculate course chapter duration

    const calculateChapterDuration= (chapter)=>{
        let time = 0
        chapter.chapterContent.map((lecture)=>
            time += lecture.lectureDuration
        )
        return humaniseDuration(time * 60 * 1000 , {units : ["h" , "m"]})
    }

    // function to calculate course Duration

    const calculateCourseDuration = (course)=>{
        let time = 0
        course.courseContent.map((chapter) => {
            chapter.chapterContent.map((lecture)=>{
                time += lecture.lectureDuration;
            })
        })
        return humaniseDuration(time * 60 * 1000 , {units:["h","m"]});
    }

    // function to calculate No. of lectures

    const calculateNoOfLectures = (course)=>{
        let totalLectures = 0;
        course.courseContent.forEach((chapter)=>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length;
            }
            })
            return totalLectures;
        }


    const value = {
        currency , allCourses , navigate , calculateRating , isEducator , setIsEducator
        ,calculateChapterDuration,calculateCourseDuration,calculateNoOfLectures , enrolledCourses,
        fetchUserEnrolledCourses
    }

    /*
    useEffect hook work with sideEffects like data fetching from API.
    useEffect() hook lets you run code after the component is mounted.
    When the AppContextProvider component is mounted , run the function inside useEffect.
    [] tells react : Only run once
    */

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

/*

This code sets up a React Context to manage and share state or functionality across components without having to pass props manually at every level.

AppContext is now a context object.
It will be used to provide and consume values globally in the component tree.

AppContextProvider : A custom that will wrap other components.
It receives props, particularly props.children, which refers to nested components.

value: The value object holds whatever data or functions you want to share via context.

This returns a Provider component that wraps around children components.
value={value} makes the value accessible to all components using this context.


*/