const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { check } = require("express-validator");

router.post(
  "/login",
  [
    check("email").isLength({ min: 1 }).normalizeEmail().isEmail(),
    check("password").isLength({ min: 1 }),
  ],
  userController.userLogin
);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").isLength({ min: 1 }).normalizeEmail().isEmail(),
    check("password").isLength({ min: 1 }),
  ],
  userController.userSignUp
);

module.exports = router;
