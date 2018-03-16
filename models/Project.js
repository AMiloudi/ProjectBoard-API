const mongoose = require('../config/database')
const { Schema } = mongoose


const statusSchema = new Schema({
  name: { type: String, required: true },
});

const projectSchema = new Schema({
  title:    {type: String, required: true },
  text:     {type: String, required:true},
  status:   [statusSchema],
});


module.exports = mongoose.model('projects', projectSchema)
