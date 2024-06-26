import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register business logic
const register = async (req, res) => {
  try {
    // lets get the body from the request

    const { name, email, bio, password } = req.body;

    // check if user required user details are available===
    if (!name || !email || !bio || !password) {
      res.status(400).json({
        success: false,
        message: 'Required fields needed',
      });
      return;
    }

    // check if email already exists
    const userExist = await User.findOne({ email: email }).exec();

    if (userExist) {
      res.status(409).json({
        success: false,
        message: 'User already exist',
      });
      return;
    }
    console.log('the user=>', userExist);

    // Encrypting the password===
    const salt = await bcrypt.genSalt(15);
    const encryptedpassword = await bcrypt.hash(password, salt);

    const newuser = await User.create({
      name,
      email,
      bio,
      password: encryptedpassword,
    });

    res.status(201).json({
      success: true,
      message: 'Registered successfully !',
      user: newuser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error !',
      user: newuser,
    });
  }
};

// login  business logic
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if email and password is sent
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Required fields needed',
      });
      return;
    }

    // check if the email exist
    const userExist = await User.findOne({ email: email }).exec();

    if (!userExist) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // compare password and check if the password is a valid
    const validPassword = await bcrypt.compare(password, userExist.password);

    if (!validPassword) {
      res.status(409).json({
        success: false,
        message: 'Invalid password',
      });
      return;
    }

    // TODO: sign a jwt token and produce cookies for access and refres
    // create an access token
    const accessToken = jwt.sign(
      {
        access1: userExist?._id,
      },
      process.env.jwt_secret,
      {
        expiresIn: process.env.accesstime,
      }
    );
    // console.log('the access toke', accessToken);

    const refreshToken = jwt.sign(
      {
        access2: userExist?._id,
      },
      process.env.refresh_secret,
      {
        expiresIn: process.env.refreshtime,
      }
    );

    // the cookies
    res.cookie('access', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1 * 60 * 1000,
    });

    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error..',
    });
  }
};

// get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).exec();
    res.status(200).json({
      success: true,
      message: 'Users fetched',
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// get a user
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// validate user
const validateUser = async (req, res) => {
  const userdetails = req.user;

  if (!userdetails) {
    res.status(400).json({
      valid: false,
      message: 'access denied',
    });
    return;
  }

  const userdata = {
    _id: userdetails._id,
    name: userdetails.name,
    email: userdetails.email,
    bio: userdetails.bio,
    image: userdetails.image,
  };
  res.status().json({
    valid: true,
    message: 'access granted',
    userDetails: userdata,
  });
};
export { register, login, getUsers, getUser, validateUser };
