const express = require('express');
const router = express.Router();
const path = require('path');
const { readData } = require('../utils/fileUtils'); // Import helper functions

const dataDir = path.join(__dirname, '..', 'data');
const menuDataPath = path.join(dataDir, 'menu.json');
const projectsDataPath = path.join(dataDir, 'projects.json');
const stallsDataPath = path.join(dataDir, 'stalls.json');
const configDataPath = path.join(dataDir, 'config.json');

// Middleware to add WhatsApp number to all responses
router.use(async (req, res, next) => {
    try {
        const config = await readData(configDataPath);
        res.locals.whatsappNumber = config.whatsappNumber;
        next();
    } catch (err) {
        console.error("Error loading config for whatsappNumber:", err);
        // You might want to provide a default or handle this error more gracefully
        res.locals.whatsappNumber = ''; // Provide a default empty string
        next(); // Continue even if config fails, or call next(err) to propagate
    }
});

// Home Page
router.get('/', async (req, res) => {
    try {
        const menuItems = await readData(menuDataPath);
        const projects = await readData(projectsDataPath);
        
        // Get featured items (first 3 menu items for display)
        const featuredItems = menuItems.slice(0, 3);
        const featuredProjects = projects.slice(0, 3);
        
        res.render('index', { 
            title: "Yayi's Confectionery",
            featuredItems,
            featuredProjects
        });
    } catch (err) {
        console.error("Error loading home page:", err);
        res.status(500).send("Error loading home page");
    }
});

// Our Menu Page
router.get('/menu', async (req, res) => {
    try {
        const menuItems = await readData(menuDataPath);
        res.render('menu', { title: 'Our Menu', menuItems });
    } catch (err) {
        res.status(500).send("Error loading menu");
    }
});

// Cake Detail Page
router.get('/menu/:id', async (req, res) => {
    try {
        const menuItems = await readData(menuDataPath);
        const cake = menuItems.find(item => item.id === req.params.id);
        if (cake) {
            res.render('cake-detail', { title: cake.name, cake });
        } else {
            res.status(404).send("Cake not found");
        }
    } catch (err) {
        res.status(500).send("Error loading cake details");
    }
});

// Project Gallery Page
router.get('/gallery', async (req, res) => {
    try {
        const projects = await readData(projectsDataPath);
        res.render('gallery', { title: 'Crafted Cakes Gallery', projects });
    } catch (err) {
        console.error("Error loading gallery:", err); // Added console log
        res.status(500).send("Error loading gallery");
    }
});

// Gallery Project Detail Page
router.get('/gallery/:id', async (req, res) => {
    console.log(`[LOG] Attempting to access gallery detail page for ID: ${req.params.id}`); // Added for debugging
    try {
        const projects = await readData(projectsDataPath);
        console.log(`[LOG] Loaded ${projects.length} projects from JSON.`); // Added for debugging
        const project = projects.find(p => p.id === req.params.id);
        
        if (project) {
            console.log(`[LOG] Project found: ${project.title}`); // Added for debugging
            res.render('gallery-detail', { 
                title: project.title, 
                project
            });
        } else {
            console.warn(`[WARN] Project with ID: ${req.params.id} not found.`); // Added for debugging
            res.status(404).send("Project not found");
        }
    } catch (err) {
        console.error("[ERROR] Error loading project details:", err);
        res.status(500).send("Error loading project details");
    }
});

// Upcoming Stalls Page
router.get('/stalls', async (req, res) => {
    try {
        const stalls = await readData(stallsDataPath);
        res.render('stalls', { title: 'Upcoming Stalls', stalls });
    } catch (err) {
        res.status(500).send("Error loading upcoming stalls");
    }
});

module.exports = router;
