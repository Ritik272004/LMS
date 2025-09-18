# 📚 LMS (Learning Management System)

A full-stack **Learning Management System** built with modern technologies that enables **educators** to create and sell courses, while **students** can explore, purchase, and learn seamlessly.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Authentication & User Management:** Clerk  
- **Payments:** Stripe  
- **Database:** MongoDB (Mongoose ODM)  

---

## ✨ Features

### 🔐 Authentication
- Secure login and logout powered by **Clerk**  
- Real-time user data synced using **Clerk Webhooks**  

---

### 👩‍🎓 Student / User Features
- Browse available courses uploaded by educators  
- Preview free lectures (if available)  
- Purchase courses via **Stripe integration**  
- **My Enrollments Page**  
  - Shows purchased courses  
  - Track progress with a progress bar  
  - Course status: Completed / Ongoing  
- Mark course as completed after finishing  
- Rate and review courses  

---

### 👨‍🏫 Educator Features
- Any user can become an educator and start earning  
- **Educator Dashboard**  
  - Total enrollments across all courses  
  - Total earnings till date  
  - Latest enrollments summary  
- Upload courses with:  
  - Thumbnail  
  - Title & Description  
  - Video link  
- Manage uploaded courses in **My Courses** section  

---

## 🖼️ Workflow

**User Side**  
Login → Browse Courses → Preview → Purchase → Learn → Mark as Complete → Rate Course

**Educator Side**  
Register as Educator → Upload Courses → Track Dashboard Stats → Earn through Enrollments


---

## 💳 Payment Flow
- Secure checkout with **Stripe**  
- Once payment succeeds → course instantly unlocked in **My Enrollments**  

---

## 📊 Database Structure
- **Users** → managed by Clerk + webhook sync  
- **Courses** → title, description, video link, thumbnail, educator reference  
- **Enrollments** → userId, courseId, status, progress, rating  

---

## 📌 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/lms.git
   cd lms


  
