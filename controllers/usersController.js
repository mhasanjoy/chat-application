const bcrypt = require("bcrypt");
const People = require("../models/People");
const { unlink } = require("fs");
const path = require("path");

async function getUsers(req, res, next) {
  try {
    const users = await People.find();
    res.render("users", { users });
  } catch (err) {
    next(err);
  }
}

async function addUser(req, res, next) {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files & (req.files.length > 0)) {
    newUser = new People({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new People({
      ...req.body,
      password: hashedPassword,
    });
  }

  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred!",
        },
      },
    });
  }
}

async function removeUser(req, res, next) {
  try {
    const user = await People.findByIdAndDelete({ _id: req.params.id });

    if (user.avatar) {
      unlink(path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    res.status(200).json({
      message: "User was removed successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
}

module.exports = {
  getUsers,
  addUser,
  removeUser,
};
