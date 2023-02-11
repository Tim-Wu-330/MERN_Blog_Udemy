const User = require("../../model/user/User");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const validateMongodbId = require("../../utils/validateMongodbID");
//-------------------------------------//
// Register
//-------------------------------------//

const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  // business logic
  // console.log(req.body);
  const userExist = await User.findOne({ email: req?.body?.email });

  if (userExist) throw new Error("User already exists");

  try {
    //Register new user
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});

//-------------------------------------//
// Login
//-------------------------------------//

const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  // business logic
  // console.log(req.body);
  //check if user exists
  const { email, password } = req.body;
  // check if password is match
  const userFound = await User.findOne({ email });

  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      _id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid  Login Credentials");
  }
});

//----------------------------------------------------------------
//Users
//----------------------------------------------------------------
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.headers);
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------------------------
//Delete user
//----------------------------------------------------------------
const deleteUsersCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deletedUsers = await User.findByIdAndDelete(id);
    res.json(deletedUsers);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------------------------
//user details
//----------------------------------------------------------------
const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  // check if user id is valid
  validateMongodbId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});

//----------------------------------------------------------------
// User profile
//----------------------------------------------------------------
const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const myProfile = await User.findById(id);
    res.json(myProfile);
  } catch (err) {
    res.json(err);
  }
});

//----------------------------------------------------------------
// Update profile
//----------------------------------------------------------------
const updateUserCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  // console.log(_id);
  validateMongodbId(_id);
  console.log("id:", _id);
  // console.log(validateMongodbId(id));
  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.json(user);
});

module.exports = {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
};
