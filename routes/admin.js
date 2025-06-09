const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const { readData, writeData } = require('../utils/fileUtils'); // Import helper functions

const dataDir = path.join(__dirname, '..', 'data');
const menuDataPath = path.join(dataDir, 'menu.json');
const projectsDataPath = path.join(dataDir, 'projects.json');
const stallsDataPath = path.join(dataDir, 'stalls.json');
const configDataPath = path.join(dataDir, 'config.json');

const defaultMenuImage = '/images/menu/default.jpg';
const defaultProjectImage = '/images/projects/default.jpg';

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest = path.join(__dirname, '..', 'public', 'images');
        if (req.baseUrl.includes('admin') && req.path.includes('menu')) {
            dest = path.join(dest, 'menu');
        } else if (req.baseUrl.includes('admin') && req.path.includes('projects')) {
            dest = path.join(dest, 'projects');
        } else {
            // Fallback or error for unexpected uploads
            return cb(new Error("Invalid upload path"));
        }
        fs.mkdirsSync(dest); // Ensure directory exists
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

// Admin Dashboard
router.get('/', async (req, res) => {
    try {
        const menuItems = await readData(menuDataPath);
        const projects = await readData(projectsDataPath);
        const stalls = await readData(stallsDataPath);

        res.render('admin/admin-dashboard', {
            title: 'Admin Panel',
            menuCount: menuItems.length,
            projectCount: projects.length,
            stallCount: stalls.length
        });
    } catch (error) {
        console.error("Error loading admin dashboard data:", error);
        // Render dashboard with 0 counts or an error message
        res.render('admin/admin-dashboard', {
            title: 'Admin Panel',
            menuCount: 0,
            projectCount: 0,
            stallCount: 0,
            pageError: "Could not load summary data for dashboard." // Changed variable name to avoid conflict
        });
    }
});

// WhatsApp Config
router.get('/config', async (req, res) => {
    const config = await readData(configDataPath);
    res.render('admin/admin-config', { title: 'WhatsApp Configuration', whatsappNumber: config.whatsappNumber });
});

router.post('/config', async (req, res) => {
    const { whatsappNumber } = req.body;
    await writeData(configDataPath, { whatsappNumber });
    res.redirect('/admin/config');
});

// Menu Manager
router.get('/menu', async (req, res) => {
    const menuItems = await readData(menuDataPath);
    res.render('admin/admin-menu', { title: 'Menu Manager', menuItems });
});

router.get('/menu/add', (req, res) => {
    res.render('admin/admin-menu-form', { title: 'Add New Cake', item: null, action: '/admin/menu/add' });
});

router.post('/menu/add', upload.single('image'), async (req, res) => {
    const { name, price, description, ingredients } = req.body;
    const newItem = {
        id: Date.now().toString(),
        name,
        price: parseFloat(price),
        description,
        ingredients: ingredients ? ingredients.split(',').map(i => i.trim()) : [],
        image: req.file ? `/images/menu/${req.file.filename}` : '/images/menu/default.jpg' // Adjust default as needed
    };
    const menuItems = await readData(menuDataPath);
    menuItems.push(newItem);
    await writeData(menuDataPath, menuItems);
    res.redirect('/admin/menu');
});

router.get('/menu/edit/:id', async (req, res) => {
    const menuItems = await readData(menuDataPath);
    const item = menuItems.find(i => i.id === req.params.id);
    if (item) {
        res.render('admin/admin-menu-form', { title: 'Edit Cake', item, action: `/admin/menu/edit/${item.id}` });
    } else {
        res.status(404).send('Menu item not found');
    }
});

router.post('/menu/edit/:id', upload.single('image'), async (req, res) => {
    const { name, price, description, ingredients } = req.body;
    const menuItems = await readData(menuDataPath);
    const itemIndex = menuItems.findIndex(i => i.id === req.params.id);
    if (itemIndex > -1) {
        const oldImagePath = menuItems[itemIndex].image;
        const updatedItem = {
            ...menuItems[itemIndex],
            name,
            price: parseFloat(price),
            description,
            ingredients: ingredients ? ingredients.split(',').map(i => i.trim()) : [],
        };
        if (req.file) {
            if (oldImagePath && oldImagePath !== defaultMenuImage) {
                await fs.unlink(path.join(__dirname, '..', 'public', oldImagePath)).catch(err => console.error("Error deleting old menu image:", err));
            }
            updatedItem.image = `/images/menu/${req.file.filename}`;
        }
        menuItems[itemIndex] = updatedItem;
        await writeData(menuDataPath, menuItems);
        res.redirect('/admin/menu');
    } else {
        res.status(404).send('Menu item not found');
    }
});

router.post('/menu/delete/:id', async (req, res) => {
    let menuItems = await readData(menuDataPath);
    const itemIndex = menuItems.findIndex(i => i.id === req.params.id);
    if (itemIndex > -1) {
        const itemToDelete = menuItems[itemIndex];
        if (itemToDelete.image && itemToDelete.image !== defaultMenuImage) {
            await fs.unlink(path.join(__dirname, '..', 'public', itemToDelete.image)).catch(err => console.error("Error deleting menu image:", err));
        }
        menuItems.splice(itemIndex, 1); // Remove item from array
        await writeData(menuDataPath, menuItems);
        res.redirect('/admin/menu');
    } else {
        res.status(404).send('Menu item not found');
    }
});


// Project Manager
router.get('/projects', async (req, res) => {
    const projects = await readData(projectsDataPath);
    res.render('admin/admin-projects', { title: 'Project Manager', projects });
});

router.get('/projects/add', (req, res) => {
    res.render('admin/admin-project-form', { title: 'Add New Project', project: null, action: '/admin/projects/add' });
});

router.post('/projects/add', upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const newProject = {
        id: Date.now().toString(),
        title,
        description,
        image: req.file ? `/images/projects/${req.file.filename}` : '/images/projects/default.jpg'
    };
    const projects = await readData(projectsDataPath);
    projects.push(newProject);
    await writeData(projectsDataPath, projects);
    res.redirect('/admin/projects');
});

router.get('/projects/edit/:id', async (req, res) => {
    const projects = await readData(projectsDataPath);
    const project = projects.find(p => p.id === req.params.id);
    if (project) {
        res.render('admin/admin-project-form', { title: 'Edit Project', project, action: `/admin/projects/edit/${project.id}` });
    } else {
        res.status(404).send('Project not found');
    }
});

router.post('/projects/edit/:id', upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const projects = await readData(projectsDataPath);
    const projectIndex = projects.findIndex(p => p.id === req.params.id);
    if (projectIndex > -1) {
        const oldImagePath = projects[projectIndex].image;
        const updatedProject = { ...projects[projectIndex], title, description };
        if (req.file) {
            if (oldImagePath && oldImagePath !== defaultProjectImage) {
                await fs.unlink(path.join(__dirname, '..', 'public', oldImagePath)).catch(err => console.error("Error deleting old project image:", err));
            }
            updatedProject.image = `/images/projects/${req.file.filename}`;
        }
        projects[projectIndex] = updatedProject;
        await writeData(projectsDataPath, projects);
        res.redirect('/admin/projects');
    } else {
        res.status(404).send('Project not found');
    }
});

router.post('/projects/delete/:id', async (req, res) => {
    let projects = await readData(projectsDataPath);
    const projectIndex = projects.findIndex(p => p.id === req.params.id);
    if (projectIndex > -1) {
        const projectToDelete = projects[projectIndex];
        if (projectToDelete.image && projectToDelete.image !== defaultProjectImage) {
            await fs.unlink(path.join(__dirname, '..', 'public', projectToDelete.image)).catch(err => console.error("Error deleting project image:", err));
        }
        projects.splice(projectIndex, 1); // Remove item from array
        await writeData(projectsDataPath, projects);
        res.redirect('/admin/projects');
    } else {
        res.status(404).send('Project not found');
    }
});

// Stall Events Manager
router.get('/stalls', async (req, res) => {
    const stalls = await readData(stallsDataPath);
    res.render('admin/admin-stalls', { title: 'Stall Events Manager', stalls });
});

router.get('/stalls/add', (req, res) => {
    res.render('admin/admin-stall-form', { title: 'Add New Stall Event', stall: null, action: '/admin/stalls/add' });
});

router.post('/stalls/add', async (req, res) => {
    const { eventName, dateTime, location, description } = req.body;
    const newStall = {
        id: Date.now().toString(),
        eventName,
        dateTime,
        location,
        description
    };
    const stalls = await readData(stallsDataPath);
    stalls.push(newStall);
    await writeData(stallsDataPath, stalls);
    res.redirect('/admin/stalls');
});

router.get('/stalls/edit/:id', async (req, res) => {
    const stalls = await readData(stallsDataPath);
    const stall = stalls.find(s => s.id === req.params.id);
    if (stall) {
        res.render('admin/admin-stall-form', { title: 'Edit Stall Event', stall, action: `/admin/stalls/edit/${stall.id}` });
    } else {
        res.status(404).send('Stall event not found');
    }
});

router.post('/stalls/edit/:id', async (req, res) => {
    const { eventName, dateTime, location, description } = req.body;
    const stalls = await readData(stallsDataPath);
    const stallIndex = stalls.findIndex(s => s.id === req.params.id);
    if (stallIndex > -1) {
        stalls[stallIndex] = { ...stalls[stallIndex], eventName, dateTime, location, description };
        await writeData(stallsDataPath, stalls);
        res.redirect('/admin/stalls');
    } else {
        res.status(404).send('Stall event not found');
    }
});

router.post('/stalls/delete/:id', async (req, res) => {
    let stalls = await readData(stallsDataPath);
    stalls = stalls.filter(s => s.id !== req.params.id);
    await writeData(stallsDataPath, stalls);
    res.redirect('/admin/stalls');
});


module.exports = router;
