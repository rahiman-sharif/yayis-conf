const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session and Flash middleware
app.use(session({
    secret: 'your secret key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(flash());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Data paths
const dataDir = path.join(__dirname, 'data');
const menuDataPath = path.join(dataDir, 'menu.json');
const projectsDataPath = path.join(dataDir, 'projects.json');
const stallsDataPath = path.join(dataDir, 'stalls.json');
const configDataPath = path.join(dataDir, 'config.json');

// Image upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest = 'public/images/';
        if (req.baseUrl.includes('menu')) {
            dest += 'menu/';
        } else if (req.baseUrl.includes('projects')) {
            dest += 'projects/';
        }
        fs.mkdirsSync(dest); // Ensure directory exists
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Helper function to read JSON data
const readData = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return []; // Return empty array if file doesn't exist
        }
        console.error(`Error reading file ${filePath}:`, err);
        throw err;
    }
};

// Helper function to write JSON data
const writeData = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error writing file ${filePath}:`, err);
        throw err;
    }
};

// --- User Routes ---
const userRoutes = require('./routes/user');
app.use('/', userRoutes);

// --- Admin Routes ---
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
