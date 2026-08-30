🛠️ Project Guidelines and Requirements
LESSON PROGRESS
0% Complete
This project is designed to enhance your skills in React by building an application that interacts with real data via a RESTful API. Until now, we've only stored data in the browser using localStorage or relied on existing data from APIs like the Pokemon API or the Movie DB. However, in a real application, we will need to persist some data, which will ultimately live inside a database. For now, it should suffice to know that some APIs expose endpoints or methods to create, read, update, or delete data, collectively known as CRUD. These actions map to the POST, GET, PUT, and DELETE HTTP request methods!

⌛ Duration: 5 days (Full Time) / 10 Days (Part Time)

📈 Presentation: TBD by Instructor | Mandatory

📝 Project Requirements

ID	Functional Requirement	Description
  FR003	Public GitHub Repository	Keep all code in a single public repo; do not add instructors as collaborators.
  FR004	Incremental Development with PRs	Merge every change into main exclusively via Pull Requests.
  FR005	React + Vite Front-End	Scaffold and run the app with Vite using React.
  FR006	TailwindCSS Styling	Style the UI with TailwindCSS (may augment with DaisyUI).
FR007	React Router Setup	Configure routing with React Router, including protected routes.
*FR008	State & Effects Management	Use React hooks (useState, useEffect, etc.) to manage UI state and side-effects.
  FR010	Run Local Events API	Clone, install and run the provided Events API locally for development.
+FR011	Home Page – Event List	Fetch events (GET /api/events) and render them as cards sorted chronologically.
  FR012	Event Card Navigation	Clicking an event card navigates to /events/:id with React Router.
  FR013	Event Details Page	Fetch and display full event data by ID (GET /api/events/:id).
  FR014	Sign-Up Page	Render registration form; send POST /api/users; on success redirect to Sign-In.
  FR015	Sign-In Page	Render login form; send POST /api/auth/login; on success store API token and redirect to Home.
  FR009	API Key Persistence	Store/retrieve the user’s API token in localStorage.
FR016	Protected Route Layout	Wrap routes that require authentication (e.g., Create Event) in a guard that redirects unauthenticated users to Sign-In.
FR017	Create Event Page	Provide a form that sends POST /api/events with the token; block access and submission if no valid token.
  FR018	Token Injection in Requests	Automatically attach the stored token to request headers
FR019	Error Handling & Feedback	Gracefully display API or network errors (e.g., auth failure, 404) to the user.
FR020	Responsive Design	Ensure the UI remains usable across mobile and desktop break-points.
FR021	Static-Site Deployment	Build the React app and deploy the static output to Render.
⚠️ API: Head over to this repo, follow the instructions for installing and running the app. You should have a working API running on your computer. The API is fully documented and you can even try some endpoints in the live documentation powered by Swagger UI. You’ll eventually learn how to create your very own RESTful APIs in the meantime, we got this.

✋ HOLD UP!

Before you even think of opening VS Code to set up your project, take a moment to plan your application:

Create a mock on Figma, MS Paint, or paper! The application is simple enough, but you can make it as pretty and cool as you want!
Plan your routes ahead of time so you can structure your application accordingly.
Break your UI into components the way you did in the past
Distribute the tasks and load
🤓 Tips for Effective Planning

Daily stand-ups: Use them to keep your instructor in the loop about blockers and to share insights with your classmates.
Keep things tidy and in order: You won't find a Trello board here, but you can create one on your own!
ASK FOR HELP: If you're stuck for more than 30 minutes, don't hesitate to reach out for assistance!
Conclusion

This project will enhance your skills with hands-on experience in working with React, managing localStorage, interacting with APIs, and creating interactive web applications. Dive in, enjoy the process, and happy coding! 🚀

Project Resources

React Documentation
TailwindCSS Documentation
DaisyUI Documentation
React Router Documentation
Web Storage API

// __PLANNING feature/imp_Routing _____________________
Prio 1 #
_________________

FR016	Protected Route Layout	Wrap routes that require authentication (e.g., Create Event) in a guard that redirects unauthenticated users to Sign-In. ## Flipped to be only visible when loged in.

FR007	React Router Setup	Configure routing with React Router, including protected routes.

FR017	Create Event Page	Provide a form that sends POST /api/events with the token; block access and submission if no valid token.

FR020	Responsive Design	Ensure the UI remains usable across mobile and desktop break-points.

__________________
OPTIONAL / PRIO 2
FR019	Error Handling & Feedback	Gracefully display API or network errors (e.g., auth failure, 404) to the user.
FR021	Static-Site Deployment	Build the React app and deploy the static output to Render.

+FR011	Home Page – Event List	Fetch events (GET /api/events) and render them as cards sorted chronologically.
*FR008	State & Effects Management	Use React hooks (useState, useEffect, etc.) to manage UI state and side-effects.
*FR018	Token Injection in Requests	Automatically attach the stored token to request headers
