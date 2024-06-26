import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

export const checkAndRenewToken = (req, res, next) => {
  const accessToken = req.cookies.access;
  const refreshToken = req.cookies.refresh;

  //   loggin the cookies
  console.log('the access token', accessToken);
  console.log('the refresh', refreshToken);

  // checking the intergrity of the access token====
  if (!accessToken) {
    // do somthing

    // to check if the refresh token is still valid
    if (!refreshToken) {
      // do somthing
      return res.status(403).json({
        success: false,
        message: 'Session expired',
      });
    } else {
      // do something else===

      // verify the refresh token===
      jwt.verify(
        refreshToken,
        process.env.refresh_secret,
        async (err, decoded) => {
          if (err) {
            return res.status(403).json({
              success: false,
              message: 'Invalid token',
            });
          } else {
            const validUser = await User.findById(decoded?.access2).exec();

            if (!validUser) {
              return res.status(404).json({
                success: false,
                message: 'Invalid User',
              });
            }
            console.log('the valid user =>', validUser);

            // generate new access token
            const accessToken = jwt.sign(
              {
                access1: validUser?._id,
              },
              process.env.jwt_secret,
              {
                expiresIn: process.env.accesstime,
              }
            );

            console.log('the new access token =>', accessToken);

            res.cookie('access', accessToken, {
              // httpOnly: true,
              // secure: true,
              sameSite: 'none',
              maxAge: 1 * 60 * 1000,
            });

            const { password, ...rest } = validUser._doc;

            req.user = rest;
            next();
          }
        }
      );
    }
  } else {
    // do another thing
    jwt.verify(accessToken, process.env.jwt_secret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid token',
        });
      } else {
        const validUser = await User.findById(decoded?.access1).exec();

        if (!validUser) {
          return res.status(404).json({
            success: false,
            message: 'Invalid User',
          });
        }
        console.log('the valid user =>', validUser);

        const { password, ...rest } = validUser._doc;
        req.user = rest;
        next();
      }
    });
  }
};

export const isAdmin = (req, res, next) => {
  const ifwest = req.user;
  if (!ifwest) {
    res.status(400).json({
      success: false,
      message: 'Not An Admin',
    });
    return;
  }
  console.log('request user details =>', ifwest);
  // checking if user is admin===
  if (!ifwest.isAdmin) {
    res.status(403).json({
      success: false,
      message: 'Not Authorized',
    });
    return;
  } else {
    next();
  }
};
