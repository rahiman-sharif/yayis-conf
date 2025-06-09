# Yayi's Confectionery Website

This project is a Node.js and Express-based website for Yayi's Confectionery, a premium cake baking company.

## Features

- **User-facing site:** Home, Menu (with cake details and WhatsApp ordering), Project Gallery, Upcoming Stalls.
- **Admin Panel:** Manage WhatsApp configuration, Menu items (cakes with images), Projects (with images), and Stall events.
- Data is stored in JSON files in the `/data` directory.
- Images are stored in `/public/images`.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS (Embedded JavaScript templates), HTML, CSS, JavaScript
- **Data Storage:** JSON files
- **Image Handling:** Multer for uploads

## Setup and Running

1.  **Clone the repository (if applicable).**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the application:**
    ```bash
    npm start
    ```
    The server will typically start on `http://localhost:3000`.

## Project Structure

- `server.js`: Main application file.
- `routes/`: Contains route handlers (`user.js`, `admin.js`).
- `views/`: EJS templates for rendering pages.
    - `partials/`: Reusable EJS partials (header, footer).
    - `admin/`: EJS templates for the admin panel.
- `public/`: Static assets.
    - `css/`: Stylesheets.
    - `js/`: Client-side JavaScript.
    - `images/`: Uploaded images for menu and projects.
- `data/`: JSON files for storing application data.
- `.github/copilot-instructions.md`: Instructions for GitHub Copilot.

## Deployment

This site is intended for deployment via Netlify (GitHub-based deployment). Ensure that the `/data` and `/public/images` directories are handled correctly during the build and deployment process to prevent data loss (e.g., by using Netlify Functions for backend logic or a persistent storage solution if dynamic data updates on the live server are frequent and need to be persisted beyond rebuilds. For a simpler static site with admin updates done locally and then pushed, ensure these directories are committed to Git and deployed).

## Admin Access

Admin panel is accessible via `/admin`. No login is required as per the project specifications.
