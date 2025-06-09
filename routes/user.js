const express = require('express');
const router = express.Router();
const path = require('path');
const { readData } = require('../utils/fileUtils'); // Import helper functions

const dataDir = path.join(__dirname, '..', 'data');
const menuDataPath = path.join(dataDir, 'menu.json');
const projectsDataPath = path.join(dataDir, 'projects.json');
const stallsDataPath = path.join(dataDir, 'stalls.json');
const configDataPath = path.join(dataDir, 'config.json');

// Home Page
router.get('/', async (req, res) => {
    try {
        // For now, just render a simple home page
        // Later, add banner, about section data
        res.render('index', { title: "Yayi's Confectionery" });
    } catch (err) {
        res.status(500).send("Error loading home page");
    }
});

// Our Menu Page
router.get('/menu', async (req, res) => {
    try {
        const menuItems = await readData(menuDataPath);
        const config = await readData(configDataPath);
        res.render('menu', { title: 'Our Menu', menuItems, whatsappNumber: config.whatsappNumber });
    } catch (err) {
        res.status(500).send("Error loading menu");
    }
});

// Cake Detail Page
router.get('/menu/:id', async (req, res) => {
    try {
        const menuItems = await readData(menuDataPath);
        const config = await readData(configDataPath);
        const cake = menuItems.find(item => item.id === req.params.id);
        if (cake) {
            res.render('cake-detail', { title: cake.name, cake, whatsappNumber: config.whatsappNumber });
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
        res.status(500).send("Error loading gallery");
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
