const User = require('../../core/user');


module.exports.getAccount = async function getAccount(req, res, next) {
  try {
    return res.json({ data: req.user.toJSON() });
  } catch (error) {
    return next(error);
  }
};


module.exports.updateAccount = async function updateAccount(req, res, next) {
  try {
    const updatedUser = await User.updateUserById(req.user.id, req.body);
    return res.json({ data: updatedUser.toJSON() });
  } catch (error) {
    return next(error);
  }
};
