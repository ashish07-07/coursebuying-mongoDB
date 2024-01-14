const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User } = require("../db/index");
const { Course } = require("../db/index");

// User Routes
router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const response = await User.create({
    username,
    password,
  });
  res.json({ message: "user signed in successfully", response });
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const course = await Course.find({});
  const username = req.header.username;
  const courseid = req.params.courseid;
  User.updateOne(
    {
      username: username,
    },
    { $push: { purchasedCourses: courseid } }
  );
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const username = req.headers.username;
  await User.updateOne(
    {
      username: username,
    },
    { $push: { purchasedCourses: courseId } }
  );
  res.json({
    message: "purchase successfull",
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  const username = req.headers.username;

  const user = await User.findOne({
    username: username,
  });
  console.log(user.purchasedCourses);

  const courses = await Course.find({
    _id: {
      $in: user.purchasedCourses,
    },
  });
  res.json({
    courses: courses,
  });
});

module.exports = router;
