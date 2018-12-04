const Notification = require('./model');


module.exports.createNotification = async function createNotification(athlete, newRecord) {
  if (!newRecord.ioFlag) {
    const ioMessage = `${newRecord.dmyDate} ${athlete.fullName} didn't weigh out`;
    return createNotif(ioMessage, athlete);
  }

  if (newRecord.deltaFlag) {
    const deltaMessage = `${newRecord.dmyDate} at ${newRecord.time} ${athlete.fullName} was dehydrated`;
    return createNotif(deltaMessage, athlete);
  }

  return false;
};


module.exports.findNotificationByAthleteIds = async function findNotificationByAthleteIds(athleteIds) {
  return Notification.find({ athlete: { $in: athleteIds } });
};


module.exports.deleteNotificationById = async function deleteNotificationById(notificationId) {
  return Notification.findOneAndRemove({ _id: notificationId });
};


module.exports.deleteNotificationByAthleteIds = async function deleteNotificationByAthleteIds(athleteId) {
  return Notification.remove({ athlete: athleteId });
};


async function createNotif(message, athlete) {
  const newNotification = new Notification();
  newNotification.athlete = athlete._id;
  newNotification.body = message;

  return newNotification.save();
}
