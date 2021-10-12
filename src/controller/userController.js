const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");

router.post(
  "/",
  body("first_name").notEmpty().withMessage("First Name is required"),
  body("last_name").notEmpty().withMessage("Last Name is required"),
  body("email").custom((val) => {
    if (!val) {
      throw new Error("EMAIL is required");
    }

    let valid =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!valid.test(val)) {
      throw new Error("Invaild Email Id");
    }

    return true;
  }),
  body("pincode").custom((val) => {
    if (!val) {
      throw new Error("PINCODE is required");
    }
    val = val.toString();
    if (val.length !== 6) {
      throw new Error("PINCODE must have 6 digits");
    }
    return true;
  }),
  body("age").custom((val) => {
    if (!val) {
      throw new Error("AGE is required");
    }

    if (+val < 1 || +val > 100) {
      throw new Error("AGE should be between 1 and 100.");
    }
    return true;
  }),
  body("gender").custom((val) => {
    if (!val) {
      throw new Error("GENDER is required");
    }
    if (val !== "Male" && val !== "Female" && val !== "Others") {
      throw new Error("GENDER should be either Male, Female or Others");
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const finalErrors = errors.array().map((e) => {
        return {
          message: e.msg,
        };
      });
      return res.status(400).send({ err: finalErrors });
    }

    const user = await User.create(req.body);

    return res.status(201).json({ user });
  }
);

module.exports = router;
