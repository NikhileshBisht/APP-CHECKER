const fs = require('fs');
const path = require('path');
const urlService = require('../services/urlService.js');
const filePath = path.join(__dirname, '../data.json');

// Reading data.json
const readDataFile = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileData) => {
      if (err) {
        console.error('Error reading file:', err);
        return reject(err);
      }
      resolve(JSON.parse(fileData));
    });
  });
};

// Writing to data.json
const writeDataFile = async (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return reject(err);
      }
      resolve();
    });
  });
};

// Register
exports.registerData = async (req, res) => {
  const { name, description, link, is_active } = req.body; 
  if (!link) {
    return res.status(400).send({ message: 'Link is required.' });
  }

  try {
    const jsonData = await readDataFile();

    const existingRecord = jsonData.find(item => item.link === link);
    if (existingRecord) {
      return res.status(409).send({ message: 'This URL already exists.' });
    }
    
    const statusCode = await urlService.checkUrlStatus(link);
    const newId = jsonData.length > 0 ? jsonData[jsonData.length - 1].id + 1 : 1;

    const record = {
      id: newId,
      name,
      description,
      link,
      status: statusCode,
      is_active: is_active !== undefined ? is_active : 1, 
      timestamp: new Date().toISOString()
    };

    jsonData.push(record);
    await writeDataFile(jsonData);
    res.status(200).send({ message: 'Data received successfully!', id: newId, statusCode });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error processing request' });
  }
};

// Update
exports.updateData = async (req, res) => {
  try {
    const { id, name, description, link, is_active } = req.body; 
    const jsonData = await readDataFile();
    
    const recordIndex = jsonData.findIndex(item => item.id === id);
    if (recordIndex === -1) {
      return res.status(404).send({ message: 'Record not found!' });
    }

    const isDuplicateLink = jsonData.some((item, index) => item.link === link && index !== recordIndex);
    if (isDuplicateLink) {
      return res.status(400).send({ message: 'Error: Link already exists in another record!' });
    }

    const statusCode = await urlService.checkUrlStatus(link);

    // Update the record with the new values
    jsonData[recordIndex] = { 
      ...jsonData[recordIndex], 
      name: name !== undefined ? name : jsonData[recordIndex].name, 
      description: description !== undefined ? description : jsonData[recordIndex].description, 
      link: link !== undefined ? link : jsonData[recordIndex].link, 
      status: statusCode,
      is_active: is_active !== undefined ? is_active : jsonData[recordIndex].is_active 
    };

    await writeDataFile(jsonData);
    res.status(200).send({ message: 'Record updated successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error processing request' });
  }
};
// Update toggle status
exports.updateToggleStatus = async (req, res) => {
  const { id, is_active } = req.body; 
  if (typeof is_active !== 'number' || (is_active !== 0 && is_active !== 1)) {
    return res.status(400).send({ message: 'is_active must be 0 or 1.' });
  }

  try {
    const jsonData = await readDataFile();

    const recordIndex = jsonData.findIndex(item => item.id === id);
    if (recordIndex === -1) {
      return res.status(404).send({ message: 'Record not found!' });
    }

    // Update the is_active field
    jsonData[recordIndex].is_active = is_active;

    await writeDataFile(jsonData);
    res.status(200).send({ message: 'Status updated successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error processing request' });
  }
};

// Show
exports.getData = async (req, res) => {
  try {
    const jsonData = await readDataFile();
    res.status(200).send(jsonData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error processing request' });
  }
};
