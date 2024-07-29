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
} = require("../controllers/users");
const { checkErrors } = require("../validators/checkErrors");
const { authAthlete, authUser, authCoach } = require("../middleware/auth");

/*-------- for all Users -------------*/
router.get("/profile/:id", authUser, getProfile);
router.patch("/profile/:id", authUser, updateProfile);
router.get("/activities", authUser, getActivities);
router.post(
  "/upload/:id", authUser,
  multerUpload.single("image"),
  cloudinaryProcessImageAndUpload,
  updateProfilePicture
);
router.patch("/activity/:id", updateActivity);

/*-------- for Athletes -------------*/
router.post("/coaches", authAthlete, getCoaches);
router.get("/coaches/:id", authAthlete, getOwnCoaches);
router.put("/coaches/:id", authAthlete, addReview);
router.get("/coaches/review", authAthlete, getCoachReviews);

/*-------- for Coaches -------------*/
router.get("/activity_types", authCoach, getActivityTypes);
router.get("/athletes/:id", authCoach, getOwnAthletes);
router.put("/athletes", authCoach, addAthlete);
router.delete("/athletes", authCoach, deleteAthlete);
router.put("/activity", authCoach, addActivity);
router.delete("/activity/:id", authCoach, deleteActivity);

module.exports = router;
