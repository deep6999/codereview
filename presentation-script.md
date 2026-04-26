# Project Presentation Script

## Title
AI Powered Code Review System

## 1. Introduction

Good morning everyone.

My name is [Your Name], and today I am going to present my project, which is an **AI Powered Code Review System**.

The main aim of this project is to help developers get quick feedback on their code. Instead of waiting for a manual review every time, the user can paste code into the system and instantly receive an AI-generated review with suggestions related to code quality, readability, performance, and best practices.

## 2. Problem Statement

In software development, code review is very important because it helps us find bugs, improve readability, and maintain coding standards.

But in many cases:

- Manual code review takes time
- Beginners do not always know what mistakes they are making
- Teams may not always be available to review code immediately

So, I built this project to provide a faster and smarter way to review code with the help of AI.

## 3. Objective

The objective of this project is:

- To allow users to submit code and get instant review feedback
- To help users improve code quality
- To provide authentication for secure user access
- To save previous reviews for signed-in users

## 4. Technologies Used

This project is built using a full stack architecture.

### Frontend

- React with Vite
- Clerk for authentication
- Axios for API communication
- React Simple Code Editor for code input
- React Markdown and syntax highlighting for displaying review output

### Backend

- Node.js
- Express.js
- Clerk Express middleware for authentication handling
- Google Gemini API for AI-generated code review

### Database

- MongoDB with Mongoose

## 5. Working of the Project

Now I will explain how the system works step by step.

1. The user opens the application interface.
2. The user writes or pastes source code into the code editor.
3. When the user clicks the review button, the frontend sends the code to the backend API.
4. The backend passes that code to the AI review service.
5. The AI analyzes the code and returns a review response.
6. The backend sends the review back to the frontend.
7. If the user is signed in, the review history is also stored in MongoDB.
8. Later, the signed-in user can view or clear previous review history.

## 6. Main Features

The main features of my project are:

- AI-based code review
- User-friendly code editor interface
- Authentication using Clerk
- Review history storage for logged-in users
- Clear history option
- Markdown-based formatted review output
- Support for guest users to review code without sign-in

## 7. Project Architecture

This project has three main parts:

### Frontend

The frontend is built in React. It provides:

- A code editor
- A review button
- A section to display AI feedback
- Sign-in and user account controls
- Review history panel

### Backend

The backend is built using Express.js. It provides API routes such as:

- `POST /ai/get-review`
- `GET /ai/history`
- `DELETE /ai/history`

The backend handles request validation, authentication, AI service integration, and history management.

### Database

MongoDB stores the review history of authenticated users. Each saved record contains:

- Clerk user ID
- Submitted code
- Generated review
- Timestamp

## 8. Authentication Flow

For authentication, I used Clerk.

- Guest users can still review code
- Signed-in users get additional features like saved history
- Clerk provides the user session and token
- The backend reads the authenticated user details before saving or fetching history

This makes the application more secure and personalized.

## 9. AI Integration

One of the most important parts of this project is AI integration.

I used the **Google Gemini API** to generate code review feedback.

The backend sends the user's code to Gemini with a system instruction that makes the AI behave like an experienced senior code reviewer. The AI then returns feedback that focuses on:

- Bugs
- Best practices
- Performance
- Security
- Readability

This makes the output more practical and useful for learners and developers.

## 10. Database Design

I used MongoDB to store review history for signed-in users.

The review history model contains:

- `clerkUserId`
- `code`
- `review`
- `createdAt`

This allows each user to access their own previous reviews.

## 11. Demo Script

During the demo, I will present the project in this order:

1. First, I will open the homepage.
2. Then I will show the code editor interface.
3. I will paste a sample code snippet.
4. I will click on the review button.
5. The system will display AI-generated feedback.
6. After that, I will sign in and show that history is saved.
7. Then I will open the history section and show previous reviews.
8. Finally, I will use the clear history option.

## 12. Advantages of the Project

The advantages of this project are:

- Saves time in code review
- Helps beginners learn coding mistakes quickly
- Provides fast and structured feedback
- Makes code quality improvement easier
- Combines AI, authentication, and database management in one project

## 13. Challenges Faced

While building this project, I faced some challenges such as:

- Connecting frontend and backend properly
- Managing authentication with Clerk
- Handling AI API responses and errors
- Storing user-specific history in MongoDB
- Making sure guest users and signed-in users both work correctly

These challenges helped me improve my understanding of full stack development.

## 14. Future Improvements

In the future, this project can be improved by adding:

- Support for multiple programming languages
- Download or export of review reports
- Review score or rating system
- More advanced AI suggestions
- Team collaboration features

## 15. Conclusion

To conclude, my project is an **AI Powered Code Review System** that helps users get instant feedback on their code.

It uses:

- React for the frontend
- Node and Express for the backend
- Clerk for authentication
- MongoDB for history storage
- Google Gemini for AI review generation

This project is useful for students, beginners, and developers who want quick code feedback and a better learning experience.

Thank you.

## 16. Short Version for Speaking Naturally

If you want to speak in a simple and natural way, you can use this shorter version:

"Good morning everyone. Today I am presenting my project, AI Powered Code Review System. The purpose of this project is to help users get instant feedback on their code using AI. In this system, the user writes or pastes code into the editor, the frontend sends that code to the backend, and the backend uses the Google Gemini API to generate a code review. If the user is signed in using Clerk authentication, the review history is stored in MongoDB, and the user can later view or clear that history. I built the frontend using React and Vite, the backend using Node.js and Express, and the database using MongoDB. This project is useful because it saves time, improves code quality, and helps beginners learn from their mistakes. Thank you."

## 17. Possible Viva Questions and Answers

### Q1. Why did you choose this project?

I chose this project because code review is an important part of software development, and I wanted to build a system that gives fast and useful feedback using AI.

### Q2. Why did you use React?

I used React because it helps build an interactive and component-based user interface efficiently.

### Q3. Why did you use Node.js and Express?

I used Node.js and Express because they are simple, fast, and suitable for building REST APIs.

### Q4. Why did you use Clerk?

I used Clerk because it provides easy and secure authentication with session and token management.

### Q5. Why did you use MongoDB?

I used MongoDB because it is flexible, easy to use with Node.js, and suitable for storing review history documents.

### Q6. What is the role of Gemini API in this project?

The Gemini API is used to analyze user code and generate review feedback like a senior code reviewer.

### Q7. What happens if the user is not logged in?

The user can still get code review results, but review history is not stored.

### Q8. What type of data is stored in the database?

The database stores the user ID, submitted code, generated review, and timestamp.
