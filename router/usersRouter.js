const express = require("express");
const { getUsers, addUser, removeUser } = require("../controllers/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const { addUserValidators, addUserValidationHandler } = require("../middlewares/users/userValidators");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

router.get("/", decorateHtmlResponse("Users"), checkLogin, getUsers);

router.post("/", checkLogin, avatarUpload, addUserValidators, addUserValidationHandler, addUser);

router.delete("/:id", removeUser);

module.exports = router;
