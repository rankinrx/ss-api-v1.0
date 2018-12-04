const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
  athlete: { type: mongoose.Schema.Types.ObjectId, ref: 'Athlete', required: true },
  body: { type: String, required: true }
}, { timestamps: true });


module.exports = mongoose.model('Notification', notificationSchema);
