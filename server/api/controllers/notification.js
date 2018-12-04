const Notification = require('../../core/notification');
const Athlete = require('../../core/athlete');


module.exports.getNotificationsByOrganization = async function getNotificationsByOrganization(req, res, next) {
  try {
    const athletes = await Athlete.findAthletesByOrganization(req.query.currentOrg);
    const athleteIds = athletes.map(athlete => athlete._id);
    const notifications = await Notification.findNotificationByAthleteIds(athleteIds);

    return res.json({ data: notifications });
  } catch (error) {
    return next(error);
  }
};


module.exports.deleteNotification = async function deleteNotification(req, res, next) {
  try {
    await Notification.deleteNotificationById(req.params.id);
    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};
