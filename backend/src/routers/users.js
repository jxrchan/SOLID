const express = require("express");
const router = express.Router();
const {multerUpload, cloudinaryProcessImageAndUpload} = require('../middleware/imageUpload')

const {
    getProfile,
    updateProfile,
    getActivities,
    getOwnCoaches,
    getCoaches,
    addReview,
    commentOwnActivity,
    getOwnAthletes,
    addActivity,
    updateActivity,
    addAthlete,
    getActivityTypes, 
    deleteActivity,
    deleteAthlete,
    updateProfilePicture,
  } = require('../controllers/users');
const { checkErrors } = require("../validators/checkErrors");
const { authAthlete, authUser, authCoach } = require("../middleware/auth");

/*-------- for all Users -------------*/
router.get('/profile', authUser, checkErrors, getProfile);
router.patch('/profile', authUser, checkErrors, updateProfile);
router.post('/profile', authUser, checkErrors, updateProfilePicture);
router.get('/activities', authUser, checkErrors, getActivities);
router.post('/upload/:id', authUser, multerUpload.single('image'), cloudinaryProcessImageAndUpload, updateProfilePicture);

/*-------- for Athletes -------------*/
router.get('/coaches', authAthlete, checkErrors, getCoaches);
router.get('/coaches/:id', authAthlete, checkErrors, getOwnCoaches);
router.put('/coaches', authAthlete, checkErrors, addReview);
router.post('/activity/:id', authAthlete, checkErrors, commentOwnActivity);

/*-------- for Coaches -------------*/
router.get('/activity_types', authCoach, checkErrors, getActivityTypes);
router.get('/athletes/:id', authCoach, checkErrors, getOwnAthletes);
router.put('/athletes', authCoach, checkErrors, addAthlete);
router.delete('/athletes', authCoach, checkErrors, deleteAthlete);
router.put('/activity', authCoach, checkErrors, addActivity);
router.delete('/activity/:id', authCoach, checkErrors, deleteActivity);
router.patch('/activity/:id',authCoach, checkErrors, updateActivity)

module.exports = router;
