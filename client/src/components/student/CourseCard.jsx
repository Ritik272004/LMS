import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const CourseCard = ({course}) => {

  const {currency , calculateRating} = useContext(AppContext)
  return (
    <Link to = {'/course/'+ course._id} onClick={()=> scrollTo(0,0)}
    className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg '>
       <img className='w-full' src={course.courseThumbnail} alt="" />
       <div className='p-3 text-left'>
        <h3 className='text-base font-semibold'> {course.courseTitle} </h3>
        <p className='text-gray-500'> Ritik Stack </p>
        <div className='flex items-center space-x-2'>
          <p> {calculateRating(course)} </p>
          <div className='flex'>
            {[...Array(5)].map((_,i)=>(<img key={i} src={i< Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5' />))}
          </div>
          <p className='text-gray-500'>{course.courseRatings.length}</p>
        </div>
        <p className='text-base font-semibold text-gray-800'>{currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)} </p>
       </div>

    </Link>
  )
}

export default CourseCard


/*


1. Array(5)
Creates an empty array of length 5.
But it's filled with undefined values, so you can’t use .map() on it directly.

2. [...Array(5)]
The spread operator (...) turns it into a real array like:  [undefined, undefined, undefined, undefined, undefined].
Now .map() can loop through it.

3. In JavaScript .map((value, index) => { ... }):
The first parameter is the current value of the array item.
The second parameter is the index (position).

4. Sometimes, you only care about the index — like when you're generating 5 items and the values are all undefined.
In that case, you can write: .map((_, index) => { ... })

*/