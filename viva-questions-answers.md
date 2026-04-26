# Viva Questions and Answers

## 1. What is the title of your project?

My project title is **AI Powered Code Review System**.

This project is designed to help users get quick feedback on their code using artificial intelligence. Instead of waiting for a teacher, senior, or teammate to manually review the code, the user can paste code into the system and get suggestions instantly.

## 2. What is your project about?

This project is a web application that reviews code with the help of AI.

The user writes or pastes code into the editor on the frontend. That code is sent to the backend. The backend sends it to the AI service, and the AI returns a review. The review may include mistakes, improvements, best practices, readability suggestions, and possible issues.

If the user signs in, the system also saves the review history in the database so it can be viewed later.

## 3. Why did you choose this project?

I chose this project because code review is a very important part of software development.

Many students and beginners write code, but they do not always know where the mistakes are or how to improve the code. Manual review also takes time. So I wanted to build a project that gives quick and useful feedback with the help of AI.

This project is also a good combination of frontend, backend, authentication, database, and AI integration, so it helped me learn full stack development.

## 4. What problem does your project solve?

This project solves the problem of delayed or unavailable code review.

Sometimes a developer or student writes code but does not get immediate feedback. Because of that, bugs and bad practices remain in the code. My project helps by giving a fast review response.

It is especially useful for:

- Students who are learning programming
- Beginners who need coding guidance
- Developers who want a quick first-level review

## 5. What is the main objective of your project?

The main objective of my project is to provide an easy system where users can submit code and get instant AI-based review feedback.

Other objectives are:

- To improve code quality
- To save previous reviews for signed-in users
- To create a simple and user-friendly interface
- To combine AI with web development in a practical project

## 6. Who can use this project?

This project can be used by:

- Students
- Beginners in programming
- Developers
- Anyone who wants quick code feedback

It is helpful for people who want to improve their code quality without waiting for manual review every time.

## 7. What technologies did you use in this project?

I used different technologies for frontend, backend, database, authentication, and AI.

### Frontend technologies

- React
- Vite
- Axios
- React Simple Code Editor
- React Markdown

### Backend technologies

- Node.js
- Express.js

### Authentication

- Clerk

### Database

- MongoDB
- Mongoose

### AI integration

- Google Gemini API

## 8. Why did you use React in the frontend?

I used React because it is very good for building interactive user interfaces.

React helps us divide the UI into components and manage data easily. In my project, React is useful for handling the code editor, showing the AI review result, managing loading states, and displaying the review history.

It also gives a smooth user experience because the page updates dynamically without reloading.

## 9. Why did you use Vite?

I used Vite because it is fast and simple for React projects.

It gives quick startup time and fast development server performance. This makes frontend development easier and smoother.

## 10. Why did you use Node.js and Express.js?

I used Node.js and Express.js for the backend because they are simple, efficient, and widely used for creating APIs.

Node.js allows JavaScript to run on the server side. Express.js helps us build routes and handle requests easily.

In my project, Express handles the API endpoints for code review, getting history, and clearing history.

## 11. Why did you use MongoDB?

I used MongoDB because it is easy to work with in Node.js applications and it stores data in flexible document format.

My project stores review history, which includes code, generated review, user ID, and timestamps. This type of data fits well in MongoDB.

Also, MongoDB works nicely with Mongoose, which makes schema creation and data handling easier.

## 12. Why did you use Mongoose?

I used Mongoose because it helps us work with MongoDB in a more structured way.

With Mongoose, I can define a schema for the review history model. This makes it easier to validate fields and manage database operations like save, find, and delete.

## 13. Why did you use Clerk for authentication?

I used Clerk because it provides an easy and secure authentication system.

Instead of building login and session management from the beginning, Clerk gives ready-made authentication features. It handles sign-in, session management, and token generation.

This saved development time and made authentication more reliable.

## 14. Why did you use Gemini API?

I used Google Gemini API because my project needs AI to analyze the code and generate a review.

Gemini helps the system act like a smart code reviewer. It reads the user’s code and gives suggestions on bugs, code quality, readability, performance, and best practices.

This is the main intelligence part of the project.

## 15. How does your project work?

The working process of my project is simple.

1. The user opens the application.
2. The user writes or pastes code into the editor.
3. The user clicks the review button.
4. The frontend sends the code to the backend.
5. The backend sends the code to the AI service.
6. The AI returns the review.
7. The backend sends the result back to the frontend.
8. The frontend displays the review to the user.
9. If the user is signed in, the review is saved in MongoDB.

## 16. What are the main features of your project?

The main features of my project are:

- AI-based code review
- Code editor interface
- Review output display
- User authentication
- Review history storage
- Clear history option
- Support for both guest users and signed-in users

## 17. What is the use of the code editor in your project?

The code editor allows the user to write or paste code directly into the application.

This makes the project more practical and user-friendly. Instead of uploading files, the user can directly test snippets of code in the interface.

## 18. What happens when the user clicks the review button?

When the user clicks the review button, the frontend sends the code to the backend API.

Then the backend processes the request and sends the code to the Gemini AI service. After that, the review result comes back from the AI and is shown on the frontend.

If the user is authenticated, the review result is also saved in the database.

## 19. What is stored in the database?

The database stores review history for signed-in users.

Each history record contains:

- Clerk user ID
- Submitted code
- Generated review
- Creation timestamp

This helps the user view previous reviews later.

## 20. Why did you save history only for logged-in users?

I saved history only for logged-in users because the system needs to know which history belongs to which person.

Without login, there is no proper identity to connect the history to a specific user. Authentication also improves privacy and makes the system more organized.

## 21. Can guest users use the project?

Yes, guest users can use the review feature.

They can paste code and get AI-generated feedback. But they cannot use personalized features like saved history, because that needs authentication.

## 22. What API routes are used in your backend?

My backend mainly uses three routes:

- `POST /ai/get-review` to review code
- `GET /ai/history` to fetch saved review history
- `DELETE /ai/history` to clear saved review history

These routes help separate the main functionalities of the system.

## 23. What is the role of the backend in your project?

The backend acts like a bridge between the frontend, the AI service, and the database.

It receives requests from the frontend, sends the code to the AI service, manages authentication-related tasks, saves history in MongoDB, and sends the final response back to the frontend.

So the backend is responsible for the main logic of the project.

## 24. What is the role of the frontend in your project?

The frontend is the part that the user interacts with directly.

It provides:

- The code editor
- Review button
- Review output section
- Sign-in option
- History panel

The frontend collects user input and displays the result in a clean way.

## 25. What is the role of AI in this project?

AI is the core part of this project.

The AI reads the submitted code and gives a review like an experienced developer. It helps identify mistakes and improvement areas. Without AI, the project would only be a normal interface and backend, but with AI it becomes intelligent and useful.

## 26. What type of review does the AI provide?

The AI provides code review suggestions such as:

- Code quality improvements
- Readability suggestions
- Best practices
- Performance improvements
- Possible bugs
- Security-related observations

The goal is to help the user write cleaner and better code.

## 27. How does authentication work in your project?

Authentication in my project is handled by Clerk.

The user signs in using Clerk. After successful sign-in, Clerk provides session information and token support. The backend uses the authenticated user information when it needs to save history, fetch history, or clear history.

This way, user-specific data stays separate and secure.

## 28. What is the benefit of using authentication in this project?

Authentication makes the project more secure and personalized.

It helps the application identify the user, save data for the correct user, and prevent unauthorized access to personal history.

It also adds a real-world feature to the project because most applications need user management.

## 29. What challenges did you face while making this project?

I faced several challenges while building this project.

Some of them were:

- Connecting frontend and backend properly
- Handling API responses correctly
- Integrating Clerk authentication
- Connecting MongoDB and storing history
- Managing AI service errors
- Supporting both guest users and signed-in users

These challenges helped me learn more about full stack development.

## 30. How did you handle errors in the project?

I handled errors by checking important conditions in the backend and frontend.

For example:

- If the code input is empty, the backend returns an error
- If the AI service is unavailable, the system returns a proper failure message
- If the user is not signed in, history-related actions are restricted
- If the database is not connected, the system handles that condition

This improves reliability and user experience.

## 31. What are the advantages of your project?

The main advantages are:

- Fast feedback on code
- Helpful for beginners
- Reduces dependency on manual review
- Saves review history for users
- Combines AI with practical software development

It is useful as both a learning tool and a productivity tool.

## 32. What are the limitations of your project?

Like every project, this one also has some limitations.

- The quality of review depends on the AI response
- It may not replace expert human review in every case
- It depends on internet-based API service
- It currently focuses on code snippet review, not full project analysis

These limitations can be improved in future versions.

## 33. How is your project different from manual code review?

Manual code review is done by a person, while my system gives automated AI-based feedback.

The main difference is speed. My project gives instant review results. However, manual review by an expert can still provide deeper business logic understanding.

So my project is more like a smart assistant for first-level review.

## 34. Can your project replace human code reviewers?

No, not completely.

My project can help by giving quick suggestions and finding common issues, but human reviewers are still important for deep understanding, architecture decisions, and business logic.

So this project supports developers, but does not fully replace experienced human reviewers.

## 35. Is your project secure?

I have added basic security-related structure through authentication and controlled backend routes.

Clerk helps manage user identity securely. Also, history actions require signed-in access. The backend only allows proper requests for history management.

Still, for production-level use, more advanced security improvements can always be added.

## 36. How does your project improve learning for students?

This project helps students learn by giving immediate feedback on their code.

If a student writes code with mistakes, the AI points out areas for improvement. This makes learning faster because the student does not need to wait for manual review every time.

It also helps students understand better coding style and best practices.

## 37. Why is this project useful in real life?

This project is useful in real life because software teams and learners both need faster feedback.

In real projects, developers want to improve code quality before final submission or deployment. In learning environments, students want to know their mistakes quickly.

This system supports both use cases.

## 38. What data model did you use for history?

I used a review history model in MongoDB.

The model includes:

- `clerkUserId`
- `code`
- `review`
- timestamps

This structure helps store each review along with the user who created it.

## 39. What is the purpose of timestamps in your database?

Timestamps help store when each review was created.

This is useful because the user can see the review history in time order. It also helps manage records better in future features like sorting, filtering, or analytics.

## 40. Why did you choose a web application for this project?

I chose a web application because it is easy to access and demonstrate.

A web app can run in the browser, which makes it user-friendly and simple to use. It also allows good integration of frontend, backend, authentication, and database in one complete system.

## 41. What did you learn from this project?

I learned many things from this project.

Some important learnings are:

- How to build a full stack application
- How to connect React frontend with Express backend
- How to integrate authentication using Clerk
- How to connect MongoDB using Mongoose
- How to integrate AI API in a practical project
- How to handle errors and user-specific features

This project improved both my technical and practical understanding.

## 42. What improvements can be added in the future?

In future, I can improve this project by adding:

- Support for more programming languages
- File upload option
- Download review report feature
- Review score or grading system
- Better UI design
- Team or classroom usage features
- More detailed analytics on code quality

These improvements can make the project more powerful and more useful.

## 43. Why is your project called AI Powered Code Review System?

It is called AI Powered Code Review System because the main review logic is driven by artificial intelligence.

The system accepts code as input and uses AI to generate review comments. That is why the project is not just a code editor or database app, but an AI-powered review system.

## 44. What happens if the AI service fails?

If the AI service fails, the backend returns an error message instead of crashing the whole application.

This is important because external services can sometimes be unavailable. Proper error handling helps keep the application stable and informs the user that the review could not be generated at that moment.

## 45. What happens if the database is not connected?

If the database is not connected, history-related features may not work properly.

In that case, the system tries to handle the issue and return a proper message. The review feature can still work if the AI service is working, but saving or fetching history may fail until the database is available again.

## 46. Why is this project a full stack project?

This is a full stack project because it includes all major parts of a modern application.

- Frontend for user interaction
- Backend for business logic
- Database for storage
- Authentication for user management
- AI integration for smart functionality

Because it uses all these layers together, it is called a full stack project.

## 47. What makes your project unique?

What makes my project unique is the combination of AI-based code review with authentication and history tracking.

Many simple projects only show AI output, but my project also manages user access and stores previous reviews for logged-in users. This makes it more practical and closer to a real application.

## 48. How will you explain the project in one minute?

My project is an AI Powered Code Review System. In this system, the user enters code in a React-based frontend. The code is sent to an Express backend, which uses the Google Gemini API to generate review feedback. If the user is logged in through Clerk authentication, the review history is stored in MongoDB. The main purpose of the project is to give quick, useful, and structured code review feedback to students and developers.

## 49. Why is this project useful for beginners?

This project is very useful for beginners because they often write code but do not know whether it follows good practices.

The AI review helps them understand mistakes, improve readability, and learn better coding habits. It acts like an instant guide while practicing programming.

## 50. What is your conclusion about this project?

My conclusion is that this project is a useful and practical application of AI in software development.

It shows how AI can be combined with frontend, backend, authentication, and database technologies to solve a real problem. It is helpful for learning, improves productivity, and has good scope for future improvements.
