import React , {useEffect, useRef , useState} from 'react'
import uniqid from 'uniqid' // used for assigning unique Id for each course
import Quill from 'quill' // Quill(a rich text editor) is used for creating and editing text content with rich formatting options in modern web.
import { assets } from '../../assets/assets';

const AddCourse = () => {

  /* useRef Hook is React is used to create mutable reference(- direct pointer to something) that persists across renders and does not cause re-renders when updated.
  It is typically used to reference DOM Elements and external Libraries like Quill Editor  , because everytime you use Quill you don't want to re-render the component
  So , that's by we use useRef Hook to store and access Quill instance without re-rendering. */
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle , setCourseTitle] = useState('')
  const [coursePrice , setCoursePrice] = useState(0)
  const [discount , setDiscount] = useState(0)
  const [image , setImage] = useState(null)
  const [chapters , setChapters] = useState([])
  const [showPopup , setShowPopup] = useState(false)
  const [currentChapterId , setCurrentChapterId] = useState(null)

  const [lectureDetails , setLectureDetails] = useState(
    {
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    }
  )

  const handleChapter = (action , chapterId , lectureIndex) => {
      if(action=== 'add'){
        const title = prompt('Enter Chapter Name: ');
        if(title){
            const newChapter = {
              chapterId: uniqid(),
              chapterTitle: title,
              chapterContent: [],
              collapsed: false,
              chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1: 1,
            };
          setChapters([...chapters , newChapter])
        }
      } else if(action === 'remove'){
        setChapters(chapters.filter((chapter)=> chapter.chapterId !== chapterId));
      } else if(action === 'toggle'){
        setChapters(
          chapters.map((chapter)=>(
            chapter.chapterId === chapterId ? {...chapter , collapsed : !chapter.collapsed} : chapter
          ))
        );
      }
  };

  const handleLecture = (action , chapterId , lectureIndex)=>{
      if(action == 'add'){
        setCurrentChapterId(chapterId);
        setShowPopup(true);
      } else if(action == 'remove'){
        setChapters(
          chapters.map((chapter)=>{
            if(chapter.chapterId === chapterId){
              chapter.chapterContent.splice(lectureIndex , 1);
            }
            return chapter;
        })
        )
      }
  }

  const addLecture = ()=>{
    setChapters(
      chapters.map((chapter)=>{
        if(chapter.chapterId === currentChapterId){
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.
            chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId : uniqid()
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle:'',
      lectureDuration:'',
      lectureUrl:'',
      isPreviewFree:false,
    });
  };

  const handleSubmit = async ()=>{
    e.preventDefault();
  }

  useEffect(()=>{
    // Initiate Quill only once
    if (!quillRef.current && editorRef.current){
      quillRef.current = new Quill(editorRef.current , {
        theme : 'snow' ,
      })
    }
  }, [])


  return (
    <div className='h-screen overflow-scroll flex flex-col items-start
    justify-between md:p-8 mb:pb-0 p-4 pt-8 pb-0'>
        <form onSubmit={()=> handleSubmit()} action="" className='flex flex-col gap-4 max-w-md w-full text-gray-500'>
          <div className='flex flex-col gap-1'>
            <p>Course Title</p>
            <input onChange={e => setCourseTitle(e.target.value)} value={courseTitle} type="text" placeholder='Type here' className='outline-none md:py-2.5 py-2 
            px-3 rounded border border-gray-500' required />
          </div>
          <div className='flex flex-col gap-1'>
              <p>Course Description</p>
              <div ref={editorRef}></div>
          </div>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input onChange={e => setCoursePrice(e.target.value)} value={coursePrice} type="number" placeholder='0' className='outline-none md:py-2.5 py-2 
            px-3 rounded border border-gray-500' />
          </div>

          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className='flex items-center gap-3'>
              <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
              <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept="Image/*" hidden />
              <img className='max-h-10' src={image ? URL.createObjectURL(image) : ''} alt="" />
            </label>
          </div>
        </div>

        <div className='fles flex-col gap-1'>
            <p>Discount %</p>
            <input onChange={e => setDiscount(e.target.value)} value={discount} type="number" placeholder='0' min={0} max={100} className='outline-none md:py-2.5 py-2 
            px-3 rounded border border-gray-500' required />
        </div>
        {/* Adding chapters and lectures */}
        <div>
          {chapters.map((chapter , chapterIndex)=>(
              <div key={chapterIndex} className='bg-white border rounded-lg mb-4'>
                <div className='flex justify-between items-center p-4 border-b'>
                  <div className='flex items-center'>
                      <img onClick = {() => handleChapter('toggle' , chapter.chapterId)} src={assets.dropdown_icon} width= {14} alt="" className={`mr-2 cursor-pointer transition-transform duration-300 ${chapter.collapsed ? '-rotate-90' : 'rotate-0'}`}/>
                      <span className='font-semibold'>{chapterIndex + 1} {chapter.chapterTitle}</span>
                  </div>
                  <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                  <img src={assets.cross_icon} alt="" className='cursor-pointer' onClick={()=> handleChapter('remove' , chapter.chapterId)} />
                </div>
                {!chapter.collapsed && (
                  <div className='p-4'>
                      {chapter.chapterContent.map((lecture , lectureIndex)=>(
                          <div key={lectureIndex} className='flex justify-between items-center mb-2'>
                            <span>{lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureDuration} target="_blank" className='text-blue-500'>Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'} </span>
                            <img src={assets.cross_icon} className='cursor-pointer' alt="" onClick={()=> handleLecture('remove' , chapter.chapterId , lectureIndex)} />
                          </div>
                      ))}
                      <div className='inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2' onClick={() => handleLecture('add',chapter.chapterId)}>+ Add Lecture</div>
                  </div>
                )}
              </div>
          ))}
          <div className='flex justify-center items-center bg-blue-100 p-2
          rounded-lg cursor-pointer' onClick={() => handleChapter('add')}>+ Add Chapter</div>
          {showPopup && (
            <div className='fixed inset-0 flex items-center justify-center
            bg-gray-800 bg-opacity-50'>
              <div className='bg-white text-gray-700 p-4 rounded relative w-full
              max-w-80'>
                 <h2 className='text-lg font-semibold mb-4'>Add Lecture</h2>

                 <div  className='mb-2'>
                  <p>Lecture Title</p>
                  <input 
                  type="text"
                    className='mt-1 block w-full border rounded py-1 px-2'
                    value={lectureDetails.lectureTitle}
                    onChange={(e) => setLectureDetails({...lectureDetails,
                      lectureTitle : e.target.value
                    })}
                   />
                 </div>

                 <div  className='mb-2'>
                  <p>Duration (minutes)</p>
                  <input 
                  type="number"
                    className='mt-1 block w-full border rounded py-1 px-2'
                    value={lectureDetails.lectureDuration}
                    onChange={(e) => setLectureDetails({...lectureDetails,
                      lectureDuration : e.target.value
                    })}
                   />
                 </div>

                 <div  className='mb-2'>
                  <p>Lecture URL</p>
                  <input 
                  type="text"
                    className='mt-1 block w-full border rounded py-1 px-2'
                    value={lectureDetails.lectureUrl}
                    onChange={(e) => setLectureDetails({...lectureDetails,
                      lectureUrl : e.target.value
                    })}
                   />
                 </div>
                 <div  className='flex gap-2 my-4'>
                  <p>Is Preview Free?</p>
                  <input 
                  type="checkbox"
                    className='mt-1 block scale-125'
                    value={lectureDetails.isPreviewFree}
                    onChange={(e) => setLectureDetails({...lectureDetails,
                      isPreviewFree : e.target.checked
                    })}
                   />
                 </div>

                 <button type='button' className='w-full bg-blue-400 text-white px-4 py-2 rounded' onClick={()=> addLecture()}>Add</button>

                 <img onClick={() => setShowPopup(false)} src={assets.cross_icon} alt="" 
                 className='absolute top-4 right-4 w-4 cursor-pointer '/>
              </div>
            </div>
          )
          }
        </div>
        <button type="submit" className='bg-black text-white w-max py-2.5 px-8
        rounded my-4'>ADD</button>
        </form>
    </div>
  )
}

export default AddCourse

/*
  The combination of fixed and inset-0 is commonly used to cover the entire screen with a fixed-position element.
  Sets the position of the element to fixed, meaning:
  It is positioned relative to the browser window, not the nearest parent.
  It stays in the same place even when the page is scrolled.

  inset-0 , This is shorthand for:
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  position: absolute;
  This means:
  The element is positioned relative to the nearest positioned ancestor 
  
  collapsed	Tracks whether chapter is hidden or not , 
  false means	Lecture content is shown
  true means	Lecture content is hidden
  Toggled by	handleChapter('toggle', chapterId)

  array.splice(startIndex, deleteCount, item1, item2, ..., itemN); 
  return the new modified array.
  const months = ["Jan", "March", "April", "June"];
  months.splice(1, 0, "Feb");
  // Inserts at index 1
  console.log(months);
  // Expected output: Array ["Jan", "Feb", "March", "April", "June"]

  months.splice(4, 1, "May");
  // Replaces 1 element at index 4
  console.log(months);
  // Expected output: Array ["Jan", "Feb", "March", "April", "May"]

  The target attribute in the <a> (anchor) tag specifies where to open the linked document

  Value	           Description
  _self	Default :  Opens the link in the same tab/window.
  _blank	 :       Opens the link in a new tab or window.
    */

