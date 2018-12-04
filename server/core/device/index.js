const httpStatus = require('http-status');
const Device = require('./model');
const APIError = require('../../helpers/APIError');


module.exports.createDevice = async function createDevice(organizationId) {
  const newDevice = new Device();
  newDevice.name = `Device ${parseInt(Math.random() * 100, 10).toString()}`;
  newDevice.organization = organizationId;

  await newDevice.save();
  return newDevice;
};

module.exports.findDevicesByOrganization = async function findDevicesByOrganization(organizationId) {
  return Device.find({ organization: organizationId });
};


module.exports.findDeviceById = async function findDeviceById(deviceId) {
  const device = await Device.findOne({ _id: deviceId });
  if (!device) throw new APIError('Device not found', httpStatus.NOT_FOUND, true);
  return device;
};


module.exports.calculateIOWeightProperties = async function calculateIOWeightProperties(athlete, organization, lastRecords, wt) {
  const measurement = parseFloat(wt);
  const today = new Date();

  const calcs = {
    type: null,
    delta: null,
    ioFlag: null,
    deltaFlag: null,
    calcMsg: null,
    wtMsg: null
  };

    // If new record, => IN
  if (lastRecords.length === 0) {
    calcs.type = 'IN';
    calcs.delta = null;
    calcs.ioFlag = false;
    calcs.deltaFlag = false;
  }
    // If more than 1 record exists
  else if (lastRecords.length >= 1) {
        // If the last record type is IN
    if (lastRecords[0].type === 'IN') {
      const lastDate = new Date(lastRecords[0].createdAt);
            // If the record was today => OUT
      if (today.toDateString() === lastDate.toDateString()) {
        calcs.type = 'OUT';
        calcs.delta = precisionRound((((lastRecords[0].weight - measurement) / lastRecords[0].weight) * 100), 1);
        calcs.ioFlag = false;
        if (calcs.delta >= organization.ioPercent) {
          calcs.deltaFlag = true;
          calcs.calcMsg = `You have lost ${calcs.delta}% of your weight since weigh-in! ${organization.ioMessage}`;
        } else {
          calcs.deltaFlag = false;
        }
      }
            // If the record was NOT today => IN w/ error
      else {
        calcs.type = 'IN';
        calcs.delta = precisionRound((((lastRecords[0].weight - measurement) / lastRecords[0].weight) * 100), 1);
        calcs.ioFlag = true;
        calcs.calcMsg = "You didn't weight-out last time. ";
        if (calcs.delta >= organization.iiPercent) {
          calcs.deltaFlag = true;
          calcs.calcMsg = `${calcs.calcMsg}You have lost ${calcs.delta}% of your weight since last weigh-in! ${organization.iiMessage}`;
        } else {
          calcs.deltaFlag = false;
          calcs.calcMsg = `${calcs.calcMsg}Make sure you remember this time!`;
        }
      }
    }
        // If the last record type is OUT => IN
    else if (lastRecords[0].type === 'OUT') {
      calcs.type = 'IN';
      calcs.delta = precisionRound((((lastRecords[1].weight - measurement) / lastRecords[1].weight) * 100), 1);
      calcs.ioFlag = false;
      if (calcs.delta >= organization.iiPercent) {
        calcs.deltaFlag = true;
        calcs.calcMsg = `You have lost ${calcs.delta}% of your weight since last weigh-in! ${organization.iiMessage}`;
      } else {
        calcs.deltaFlag = false;
      }
    } else {
            // TODO: Throw error
            // next("Weight Calculation Error!");
    }
  }

  calcs.wtMsg = athlete.showWeight ? `Weight ${calcs.type} at ${measurement} lbs.` : `Weight ${calcs.type}.`;
  return calcs;
};


module.exports.calculateSWeightProperties = async function calculateSWeightProperties(athlete, weight) {
  return {
    type: 'SAVE',
    delta: null,
    ioFlag: false,
    deltaFlag: false,
    calcMsg: null,
    wtMsg: athlete.showWeight ? `Weight Saved at ${weight} lbs.` : 'Weight Saved',
  };
};


/**
 * Function for Rounding Weight Calculations
 */
function precisionRound(number, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
