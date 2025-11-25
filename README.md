# Task Management App

A simple task management app with user authentication, profile management, and task CRUD operations.

---

## API Documentation

**Base URL:** `http://localhost:3000/api`

### Endpoints

| Method | Path               | Description                      | Request Body                                     | Response                             |
|--------|--------------------|----------------------------------|----------------------------------------          |--------------------------------------|
| POST   | `/auth/register`   | Register a new user              | `{ name, email, password }`                      | `{ message, user }` or error message |
| POST   | `/auth/login`      | Authenticate user & get token    | `{ email, password }`                            | `{ token }` or error message         |
| GET    | `/profile`         | Get authenticated user's profile | Auth header: `Bearer <token>`                    | `{ name, email, ... }` or error      |
| PUT    | `/profile`         | Update user profile              | Auth header + `{ name, email }`                  | Updated user data or error           |
| GET    | `/tasks`           | Get tasks, supports filters      | Auth header + optional query: `search`, `status` | List of tasks or error               |
| POST   | `/tasks`           | Create a new task                | Auth header + `{ title, description }`           | Created task or error                |
| PUT    | `/tasks/:id`       | Edit task                        | Auth header + `{ title, description, status }`   | Updated task or error                |
| DELETE | `/tasks/:id`       | Delete task                      | Auth header                                      | Success message or error             |

---

## Scalability & Production Integration Notes

### Frontend-Backend Integration Scalability

- **API Versioning:** Use versioned endpoints (`/api/v1/...`) to manage breaking changes and backward compatibility.
- **Authentication:** Secure token storage with refresh tokens; centralized auth context on frontend.
- **Error Handling:** Standardized error responses and graceful front-end reporting.
- **Rate Limiting & Caching:** Backend rate limiting and caching headers; frontend caching of static data.
- **Modular API Calls:** Separate API logic into service files (e.g., `authService.js`) for maintainability.
- **State Management:** Use global or context state to optimize data fetching and avoid redundancy.
- **Lazy Loading & Code Splitting:** Improve performance via route and component lazy loading.
- **CI/CD Pipelines:** Automate environment-based deployments.

### Frontend Project Structure

src/
├─ components/ # Reusable UI components (Spinner, Buttons)
├─ context/ # Context providers (AuthContext)
├─ pages/ # Pages/routes (Login, Register, Dashboard, Profile)
├─ services/ # API call wrappers (authService.js, taskService.js)
├─ hooks/ # Custom React hooks
├─ utils/ # Utility functions and constants
├─ App.jsx # Main app component and routing
├─ index.js # Entry point

- Separation of concerns enhances maintainability, testing, and scalability.
- Component and service reusability helps future feature expansion.

---

## Running the App

1. Clone the repo.
2. Run `npm install` to install dependencies.
3. Set up environment variables as needed.
4. Start the backend API (`localhost:3000` assumed).
5. Run `npm start` to launch the frontend.
6. Use the provided Postman collection (if any) to test APIs.

---

Thank you for reviewing this project! For any questions, please contact me.
