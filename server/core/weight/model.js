const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose, 1);
const moment = require('moment');


const weightSchema = new mongoose.Schema({
  athlete: { type: mongoose.Schema.Types.ObjectId, ref: 'Athlete', required: true },
  type: { type: String, enum: ['IN', 'OUT', 'SAVE'], required: true },
  weight: { type: Float, required: true },
  delta: { type: Float, default: 0 },
  ioFlag: { type: Boolean, default: false },
  deltaFlag: { type: Boolean, default: false },
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  method: { type: String, enum: ['passcode', 'fingerprint'], required: true }
}, { timestamps: true });


weightSchema.virtual('dmyDate').get(function getDate() {
  return moment(this.createdAt).format('L');
});

weightSchema.virtual('time').get(function getTime() {
  return moment(this.createdAt).format('LT');
});


module.exports = mongoose.model('Weight', weightSchema);
