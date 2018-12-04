const Weight = require('./model');


module.exports.findWeightByAthleteIds = async function findWeightByAthleteIds(athleteIds) {
  return Weight.find({ athlete: { $in: athleteIds } }).sort({ createdAt: -1 });
};


module.exports.findWeightByAthleteIdWhereIOType = async function findWeightByAthleteIdWhereIOType(athleteId) {
  return Weight.find({ athlete: athleteId })
        .where('type')
        .in(['IN', 'OUT'])
        .sort({ createdAt: -1 })
        .limit(3);
};


module.exports.createAndSaveWeight = async function createAndSaveWeight(deviceId, athleteId, authType, wt, calcs) {
  const newWeight = new Weight();

  newWeight.device = deviceId;
  newWeight.athlete = athleteId;
  newWeight.method = authType;
  newWeight.weight = wt;
  newWeight.type = calcs.type;
  newWeight.delta = calcs.delta;
  newWeight.ioFlag = calcs.ioFlag;
  newWeight.deltaFlag = calcs.deltaFlag;

  return newWeight.save();
};


module.exports.deleteWeightByAthleteIds = async function deleteWeightByAthleteIds(athleteIds) {
  return Weight.remove({ athlete: { $in: athleteIds } });
};
