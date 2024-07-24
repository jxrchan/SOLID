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
router.get('/profile/:id', getProfile);
router.patch('/profile/:id', updateProfile);
router.get('/activities', getActivities);
router.post('/upload/:id', multerUpload.single('image'), cloudinaryProcessImageAndUpload, updateProfilePicture);

/*-------- for Athletes -------------*/
router.get('/coaches', getCoaches);
router.get('/coaches/:id', getOwnCoaches);
router.put('/coaches/:id', addReview);
router.post('/activity/:id', commentOwnActivity);

/*-------- for Coaches -------------*/
router.get('/activity_types', getActivityTypes);
router.get('/athletes/:id', getOwnAthletes);
router.put('/athletes', addAthlete);
router.delete('/athletes/:id', deleteAthlete);
router.put('/activity', addActivity);
router.delete('/activity/:id', deleteActivity);
router.patch('/activity/:id', updateActivity)

module.exports = router;