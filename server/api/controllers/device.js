const Device = require('../../core/device');
const Athlete = require('../../core/athlete');
const Weight = require('../../core/weight');
const Organization = require('../../core/organization');
const Notification = require('../../core/notification');


module.exports.getDevicesByOrganization = async function getDevicesByOrganization(req, res, next) {
  try {
    const devices = await Device.findDevicesByOrganization(req.query.currentOrg);
    return res.json({ data: devices });
  } catch (error) {
    return next(error);
  }
};


module.exports.addDeviceForOrganization = async function addDeviceForOrganization(req, res, next) {
  try {
    const device = await Device.createDevice(req.query.currentOrg);
    return res.json({ data: device });
  } catch (error) {
    return next(error);
  }
};


module.exports.recordWeight = async function recordWeight(req, res, next) {
  try {
    const device = await Device.findDeviceById(req.params.id);
    const athlete = await Athlete.findAthleteByAuthType(device.organization, req.body.authType, req.body.authId);
    let calcs;
    if (req.body.operation === 'io') {
      const organization = await Organization.findOrganizationById(device.organization);
      const lastRecords = await Weight.findWeightByAthleteIdWhereIOType(athlete.id);
      calcs = await Device.calculateIOWeightProperties(athlete, organization, lastRecords, req.body.wt);
    } else {
      calcs = await Device.calculateSWeightProperties(athlete, req.body.wt);
    }

    const weight = await Weight.createAndSaveWeight(device._id, athlete._id, req.body.authType, req.body.wt, calcs);

    if (req.body.operation === 'io') await Notification.createNotification(athlete, weight);

    return res.json({
      data: {
        wtMsg: calcs.wtMsg,
        calcMsg: calcs.calcMsg,
        entry: weight
      }
    });
  } catch (error) {
    return next(error);
  }
};
