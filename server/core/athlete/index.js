const httpStatus = require('http-status');
const Athlete = require('./model');
const APIError = require('../../helpers/APIError');


module.exports.createAthelete = async function createAthelete(athleteData) {
  const findOpts = {
    passcode: athleteData.passcode,
    organization: athleteData.organization
  };
  const existingAthletes = await Athlete.find(findOpts);
  if (existingAthletes.length) {
    throw new APIError('Account with that passcode already exists', httpStatus.CONFLICT, true, 1108);
  }

  try {
    const newAthlete = new Athlete(athleteData);
    await newAthlete.save();
    return newAthlete;
  } catch (err) {
    if (err.errors.passcode) {
      if (err.errors.passcode.kind === 'unique') {
        throw new APIError('Passcode Exists', httpStatus.CONFLICT, true, 1508);
      }
      if (err.errors.passcode.kind === 'max' || err.errors.passcode.kind === 'min') {
        throw new APIError('Passcode Out of Range', httpStatus.BAD_REQUEST, true, 1509);
      }
      throw new APIError('Passcode Error', httpStatus.BAD_REQUEST, true, 1509);
    } else {
      throw err;
    }
  }
};


module.exports.findAthletesByOrganization = async function findAthletesByOrganization(organizationId) {
  const athletes = await Athlete.find({ organization: organizationId });
  return athletes;
};


module.exports.findAthleteById = async function findAthleteById(athleteId) {
  const athlete = await Athlete.findOne({ _id: athleteId });
  if (!athlete) throw new APIError('Athlete not found', httpStatus.NOT_FOUND, true);
  return athlete;
};


module.exports.findAthleteByAuthType = async function findAthleteByAuthType(organizationId, authType, authId) {
  if (authType !== 'fingerprint' && authType !== 'passcode') {
    throw new APIError("E1441: Incorrect Parameter 'authType'", httpStatus.UNAUTHORIZED, true);
  }

  const athlete = await Athlete.findOne({ organization: organizationId }).where(authType, authId);
  if (!athlete) throw new APIError('Athlete not found', httpStatus.NOT_FOUND, true);
  return athlete;
};


module.exports.updateAthleteById = async function updateAthleteById(athleteId, athleteData) {
  try {
    const findOpts = { _id: athleteId };
    const athlete = await Athlete.findOneAndUpdate(findOpts, athleteData, { new: true });
    if (!athlete) throw new APIError('Athlete not found', httpStatus.NOT_FOUND, true);

    return athlete;
  } catch (err) {
    if (err.errors.fingerprint) {
      if (err.errors.fingerprint.kind === 'unique') {
        throw new APIError('Fingerprint Exists', httpStatus.CONFLICT, true, 1508);
      }
      if (err.errors.fingerprint.kind === 'max' || err.errors.fingerprint.kind === 'min') {
        throw new APIError('Fingerprint Out of Range', httpStatus.BAD_REQUEST, true, 1509);
      }
      throw new APIError('Fingerprint Error', httpStatus.BAD_REQUEST, true, 1509);
    } else if (err.errors.passcode) {
      if (err.errors.passcode.kind === 'unique') {
        throw new APIError('Passcode Exists', httpStatus.CONFLICT, true, 1508);
      }
      if (err.errors.passcode.kind === 'max' || err.errors.passcode.kind === 'min') {
        throw new APIError('Passcode Out of Range', httpStatus.BAD_REQUEST, true, 1509);
      }
      throw new APIError('Passcode Error', httpStatus.BAD_REQUEST, true, 1509);
    } else if (err.errors.gender) {
      if (err.errors.gender.kind === 'enum') {
        throw new APIError("Value Must Be 'Male' or 'Female'", httpStatus.BAD_REQUEST, true, 1511);
      }
      throw new APIError('Gender Error', httpStatus.BAD_REQUEST, true, 1509);
    } else if (err.errors['sport.0']) {
      if (err.errors['sport.0'].kind === 'enum') {
        throw new APIError("Value Must Be 'Football', 'Baseball', 'Wrestling'", httpStatus.BAD_REQUEST, true, 1511);
      }
      throw new APIError('Sport Error', httpStatus.BAD_REQUEST, true, 1509);
    } else {
      throw err;
    }
  }
};


module.exports.deleteAthleteById = async function deleteAthleteById(athleteId) {
  const deletedAthlete = await Athlete.findByIdAndRemove(athleteId);
  if (!deletedAthlete) throw new APIError('Athlete not found', httpStatus.NOT_FOUND, true);
  return deletedAthlete;
};


module.exports.deleteAthletesByOrganization = async function deleteAthletesByOrganization(organizationId) {
  const deletedAthletes = await Athlete.remove({ organization: organizationId });
  return deletedAthletes;
};
