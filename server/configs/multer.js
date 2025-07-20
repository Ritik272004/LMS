import multer from 'multer'
// Multer package is a middleware that handle file uploads ,  parse multipart-form data request especially HTML FORM and attach uploaded file to req.file.

const storage = multer.diskStorage({})

const upload = multer({storage})

export default upload