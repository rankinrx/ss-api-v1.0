const Athlete = require('../../core/athlete');
const Weight = require('../../core/weight');
const Organization = require('../../core/organization');
const Notification = require('../../core/notification');


module.exports.getAthletesByOrganizationRoute = async function getAthletesByOrganizationRoute(req, res, next) {
  try {
    const athletes = await Athlete.findAthletesByOrganization(req.query.currentOrg);
    return res.json({ data: athletes });
  } catch (error) {
    return next(error);
  }
};


module.exports.addAthleteForOrganizationRoute = async function addAthleteForOrganizationRoute(req, res, next) {
  try {
    const athlete = await Athlete.createAthelete({ ...req.body, organization: req.query.currentOrg });
    return res.json({ data: athlete });
  } catch (error) {
    return next(error);
  }
};


module.exports.updateAthleteRoute = async function updateAthleteRoute(req, res, next) {
  try {
    const athlete = await Athlete.updateAthleteById(req.params.id, req.body);
    return res.json({ data: athlete });
  } catch (error) {
    return next(error);
  }
};


module.exports.deleteAthletesByOrganizationRoute = async function deleteAthletesByOrganizationRoute(req, res, next) {
  try {
    const athletes = await Athlete.findAthletesByOrganization(req.query.currentOrg);
    const athleteIds = athletes.map(athlete => athlete._id);
    await Weight.deleteWeightByAthleteIds(athleteIds);
    await Notification.deleteNotificationByAthleteIds(athleteIds);
    await Athlete.deleteAthletesByOrganization(req.query.currentOrg);
    return res.json({ data: athletes });
  } catch (error) {
    return next(error);
  }
};


module.exports.deleteAthleteRoute = async function deleteAthleteRoute(req, res, next) {
  try {
    const athlete = await Athlete.deleteAthleteById(req.params.id);
    await Weight.deleteWeightByAthleteIds([athlete._id]);
    await Notification.deleteNotificationByAthleteIds([athlete._id]);
    return res.json({ data: athlete });
  } catch (error) {
    return next(error);
  }
};


module.exports.getAthleteWeightsRoute = async function getAthleteWeightsRoute(req, res, next) {
  try {
    const athlete = await Athlete.findAthleteById(req.params.id);
    const organization = await Organization.findOrganizationById(athlete.organization);
    const weights = await Weight.findWeightByAthleteIds([req.params.id]);
    const weightResults = weights.map(weight => ({
      type: weight.type,
      date: weight.dmyDate,
      time: weight.time,
      weight: weight.weight,
      delta: weight.delta,
    }));

    return res.json({
      data: {
        athlete: {
          id: athlete._id,
          fullName: athlete.fullName,
          org: organization.name,
          age: athlete.age,
          bodyFat: athlete.bodyFat,
          birthday: athlete.dmy_Bday,
          sport: athlete.sport,
          gender: athlete.gender
        },
        weights: weightResults,
      }
    });
  } catch (error) {
    return next(error);
  }
};
