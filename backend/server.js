const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { performance } = require('perf_hooks'); // Import performance module
const app = express();

const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0:27017/my_database'); 

const dataSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const Data = mongoose.model('Data', dataSchema);

app.post('/api/add', async (req, res) => {
  const startTime = performance.now();
  try {
    const data = new Data(req.body);
    await data.save();
    console.log('Add API Execution Time:', performance.now() - startTime);
    res.status(201).json({ message: 'Data added successfully' });
  } catch (error) {
    console.error('Error in Add API:', error);
    res.status(500).json({ message: 'Error in adding data' });
  }
});

app.put('/api/update', async (req, res) => {
  const startTime = performance.now();
  try {
    const data = await Data.findOne({ name: req.body.name });
    if (data) {
      data.age = req.body.age;
      await data.save();
      console.log('Update API Execution Time:', performance.now() - startTime);
      res.status(200).json({ message: 'Data updated successfully' });
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    console.error('Error in Update API:', error);
    res.status(500).json({ message: 'Error in updating data' });
  }
});

app.get('/api/count', async (req, res) => {
  try {
    const addCount = await Data.countDocuments();
    const updateCount = addCount;
    res.status(200).json({ addCount, updateCount });
  } catch (error) {
    console.error('Error in Count API:', error);
    res.status(500).json({ message: 'Error in getting count' });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
