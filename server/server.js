 /*
 What is the use of Cors Package
 First, understand the problem that CORS solves:
 Imagine:

    You are building a frontend using React (http://localhost:3000)

    You are building a backend using Express (http://localhost:5000)

    Your React app tries to call the backend API: fetch('http://localhost:5000/api/data')

    The browser will block this request due to CORS(Cross Origin Resource Sharing) policy, because:
    The frontend and backend are on different origins (ports/domains).
    By default, browsers don’t allow such “cross-origin” requests for security reasons.

     Solution: Use cors package in Express
    The cors package is a middleware that sets special HTTP headers in the backend response to tell the browser:
    "Hey browser, it’s okay to let this frontend access my data."

    What is Cloudinary?
    Cloudinary is a cloud-based service for:
    Uploading images & videos ✅
    Storing them securely in the cloud ☁️
    Optimizing & transforming media (resize, crop, compress, etc.) 

    multer is a middleware for Node.js and Express that is used to handle file uploads, especially multipart/form-data (the encoding used when uploading files via an HTML form).
    Why do we need multer?
    When a user uploads a file (like an image), the file comes as binary data inside a multipart/form-data HTTP request.
    Express can’t understand this format by default — so we use multer to:
    🔄 Parse the form data
    💾 Save the file to a folder or memory
    📁 Allow you to access it through req.file or req.files

    svix@1.42.0 is a client for interacting with Svix’s API.
    Enables you to send webhooks with robust delivery features.
    Helps you receive and verify incoming webhooks securely.
    Great for production-grade apps needing reliable, scalable webhooks.

    A webhook is an HTTP POST request sent by a system to another system's URL when a certain event occurs.
    eg:
    What is a Webhook in GitHub?
    A GitHub Webhook is a way for GitHub to notify your server when something happens in your repo (like a push, pull request, issue opened, etc.).
    Think of it like this:
    GitHub says: “Hey! Someone pushed code to this repo — here’s the data about what happened,”
    and it sends that data to your server automatically using an HTTP POST request.
    
    set "type": "module" to use import and export statement in our project

    We create user model to store new user data in our Database. Whenever new user is created through clerk , we get user data from clerk webhook and store that data in our database. 
 */

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

const app = express()

// Connect to Database

await connectDB()

// Middlewares
app.use(cors()) // to connect backend to any other domain

// Routes
app.get('/' ,(req,res)=> res.send('API  Working fine'))
app.post('/clerk' , express.json() , clerkWebhooks)
/* Now , we have to upload our project on github then we publish our backend project using versal . After that we get backend URL , using this URL we can generate webhook secret from clerk dashboard   */

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT , ()=>{
   console.log(`Server running on Port ${PORT}`)
})