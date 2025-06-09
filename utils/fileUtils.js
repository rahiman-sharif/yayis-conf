const fs = require('fs-extra');
const path = require('path');

const readData = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // If file doesn't exist, create it with default content based on its purpose
            if (filePath.endsWith('config.json')) {
                await fs.writeFile(filePath, JSON.stringify({ whatsappNumber: "" }), 'utf8');
                return { whatsappNumber: "" };
            } else {
                await fs.writeFile(filePath, '[]', 'utf8');
                return [];
            }
        }
        console.error(`Error reading file ${filePath}:`, err);
        throw err;
    }
};

const writeData = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error writing file ${filePath}:`, err);
        throw err;
    }
};

module.exports = {
    readData,
    writeData
};
