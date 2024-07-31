const express = require("express");
const router = express.Router();
const {
  multerUpload,
  cloudinaryProcessImageAndUpload,
} = require("../middleware/imageUpload");

const {
  getProfile,
  updateProfile,
  getActivities,
  getOwnCoaches,
  getCoaches,
  addReview,
  getOwnAthletes,
  addActivity,
  updateActivity,
  addAthlete,
  getActivityTypes,
  deleteActivity,
  deleteAthlete,
  updateProfilePicture,
  getCoachReviews,
  getOwnCoachName,
  getOwnAthleteName,
} = require("../controllers/users");
const { checkErrors } = require("../validators/checkErrors");
const { authAthlete, authUser, authCoach } = require("../middleware/auth");
const {
  validateUpdateProfile,
  validateGetActivities,
  validateUpdateActivity,
  validateGetCoaches,
  validateGetOwnCoachName,
  validateGetOwnAthleteName,
  validateAddAthlete,
  validateDeleteAthlete,
  validateAddActivity,
  validateDeleteActivity,
} = require("../validators/users");

/*-------- for all Users -------------*/
router.get("/profile", authUser, getProfile);
router.patch(
  "/profile",
  validateUpdateProfile,
  checkErrors,
  authUser,
  updateProfile
);
router.post(
  "/activities",
  validateGetActivities,
  checkErrors,
  authUser,
  getActivities
);
router.post(
  "/upload",
  authUser,
  multerUpload.single("image"),
  cloudinaryProcessImageAndUpload,
  updateProfilePicture
);
router.patch(
  "/activity/:id",
  validateUpdateActivity,
  checkErrors,
  updateActivity
);

/*-------- for Athletes -------------*/
router.post(
  "/coaches",
  validateGetCoaches,
  checkErrors,
  authAthlete,
  getCoaches
);
router.get("/coaches", authAthlete, getOwnCoaches);
router.post(
  "/coach",
  validateGetOwnCoachName,
  checkErrors,
  authAthlete,
  getOwnCoachName
);
// router.put("/coaches/:id", authAthlete, addReview);
// router.get("/coaches/review", authAthlete, getCoachReviews);

/*-------- for Coaches -------------*/
router.get("/activity_types", authCoach, getActivityTypes);
router.get("/athletes", authCoach, getOwnAthletes);
router.post(
  "/athlete",
  validateGetOwnAthleteName,
  checkErrors,
  authCoach,
  getOwnAthleteName
);
router.put("/athletes", validateAddAthlete, checkErrors, authCoach, addAthlete);
router.delete(
  "/athletes",
  validateDeleteAthlete,
  checkErrors,
  authCoach,
  deleteAthlete
);
router.put(
  "/activity",
  validateAddActivity,
  checkErrors,
  authCoach,
  addActivity
);
router.delete(
  "/activity/:id",
  validateDeleteActivity,
  checkErrors,
  authCoach,
  deleteActivity
);

module.exports = router;
