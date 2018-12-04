const express = require('express');
const passport = require('passport');
const validate = require('express-validation');

const auth = require('./server/api/controllers/auth');
const authRoutesV = require('./server/api/controllers/auth.validation');
const general = require('./server/api/controllers/general');
const generalRoutesV = require('./server/api/controllers/general.validation');
const account = require('./server/api/controllers/account');
const accountRoutesV = require('./server/api/controllers/account.validation');
const athlete = require('./server/api/controllers/athlete');
const athleteRoutesV = require('./server/api/controllers/athlete.validation');
const device = require('./server/api/controllers/device');
const deviceRoutesV = require('./server/api/controllers/device.validation');
const notification = require('./server/api/controllers/notification');
const notificationRoutesV = require('./server/api/controllers/notification.validation');
const organization = require('./server/api/controllers/organization');
const organizationRoutesV = require('./server/api/controllers/organization.validation');

const router = express.Router();


router.post('/api/signup',
    validate(authRoutesV.signupSchema),
    auth.signup
);
router.post('/api/login',
    validate(authRoutesV.loginSchema),
    auth.login
);
router.post('/api/forgot',
    validate(authRoutesV.forgotPasswordSchema),
    auth.forgotPassword
);
router.post('/api/reset/:token',
    validate(authRoutesV.resetPasswordSchema),
    auth.resetPassword
);

router.post('/api/contact',
    validate(generalRoutesV.postContactFormSchema),
    general.postContactForm
);

router.get('/api/accounts',
    passport.authenticate('jwt', { session: false }),
    validate(accountRoutesV.getAccountSchema),
    account.getAccount
);
router.put('/api/accounts',
    passport.authenticate('jwt', { session: false }),
    validate(accountRoutesV.updateAccountSchema),
    account.updateAccount
);

router.get('/api/organizations',
    passport.authenticate('jwt', { session: false }),
    validate(organizationRoutesV.getOrganizationsSchema),
    organization.getOrganizationsRoute
);
router.post('/api/organizations',
    passport.authenticate('jwt', { session: false }),
    validate(organizationRoutesV.addOrganizationSchema),
    organization.addOrganizationRoute
);
router.get('/api/organizations/:id',
    passport.authenticate('jwt', { session: false }),
    validate(organizationRoutesV.getOrganizationSchema),
    organization.getOrganizationRoute
);
router.put('/api/organizations/:id',
    passport.authenticate('jwt', { session: false }),
    validate(organizationRoutesV.updateOrganizationSchema),
    organization.updateOrganizationRoute
);

router.get('/api/devices',
    passport.authenticate('jwt', { session: false }),
    validate(deviceRoutesV.getDevicesByOrganizationSchema),
    device.getDevicesByOrganization
);
router.post('/api/devices',
    passport.authenticate('jwt', { session: false }),
    validate(deviceRoutesV.addDeviceForOrganizationSchema),
    device.addDeviceForOrganization
);
router.post('/api/devices/:id/weight',
    passport.authenticate('jwt', { session: false }),
    validate(deviceRoutesV.recordWeightSchema),
    device.recordWeight
);

router.get('/api/athletes',
    passport.authenticate('jwt', { session: false, failWithError: true }),
    validate(athleteRoutesV.getAthletesByOrganizationSchema),
    athlete.getAthletesByOrganizationRoute
);
router.post('/api/athletes',
    passport.authenticate('jwt', { session: false }),
    validate(athleteRoutesV.addAthleteForOrganizationSchema),
    athlete.addAthleteForOrganizationRoute
);
router.put('/api/athletes/:id',
    passport.authenticate('jwt', { session: false }),
    validate(athleteRoutesV.updateAthleteSchema),
    athlete.updateAthleteRoute
);
router.delete('/api/athletes',
    passport.authenticate('jwt', { session: false }),
    validate(athleteRoutesV.deleteAthletesByOrganizationSchema),
    athlete.deleteAthletesByOrganizationRoute
);
router.delete('/api/athletes/:id',
    passport.authenticate('jwt', { session: false }),
    validate(athleteRoutesV.deleteAthleteSchema),
    athlete.deleteAthleteRoute
);
router.get('/api/athletes/:id/weights',
    passport.authenticate('jwt', { session: false }),
    validate(athleteRoutesV.getAthleteWeightsSchema),
    athlete.getAthleteWeightsRoute
);

router.get('/api/notifications',
    passport.authenticate('jwt', { session: false }),
    validate(notificationRoutesV.getNotificationsByOrganizationSchema),
    notification.getNotificationsByOrganization
);
router.delete('/api/notifications/:id',
    passport.authenticate('jwt', { session: false }),
    validate(notificationRoutesV.deleteNotificationSchema),
    notification.deleteNotification
);


module.exports = router;
