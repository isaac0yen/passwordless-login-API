import _MySQL from './mySQL.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Validate from './Validate.js';
import ThrowError from './ThrowError.js';

const setJWT = async (id) => {
  try {
    if (!Validate.integer(id)) {
      ThrowError('Invalid user ID ' + id);
    }

    // Find the user by ID
    let user;
    try {
      user = await _MySQL.findOne('user', { id });
    } catch (error) {
      ThrowError('Error finding user', error);
    }

    if (!user) {
      ThrowError('User not found');
    }

    // Generate an access token
    let accessToken;
    try {
      accessToken = await jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
    } catch (error) {
      ThrowError('Error signing access token', error);
    }

    // Generate a refresh token and update user record
    const refreshId = Math.round(Math.random() * 9999999999) + '.' + Date.now();
    try {
      await _MySQL.updateOne('user', { id }, { refresh_id: refreshId });
    } catch (error) {
      ThrowError('Error updating user refresh ID', error);
    }

    let refreshToken;
    try {
      const refreshObject = {
        id,
        refreshId,
      };
      refreshToken = await jwt.sign(refreshObject, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
    } catch (error) {
      ThrowError('Error signing refresh token', error);
    }

    return { accessToken, refreshToken };
  } catch (error) {
    // Log or handle the error as needed
    console.error(error);
    return null;
  }
};

export default setJWT;
