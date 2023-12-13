import ThrowError from '../Helpers/ThrowError.js';
import Validate from '../Helpers/Validate.js';
import TokenGenerator from '../Helpers/TokenGenerator.js';
import _MySQL from '../Helpers/mySQL.js';
import sendEmail from '../Helpers/SendMail.js';
import fs from 'fs';
import Replacer from '../Helpers/Replacer.js';
import { DateTime } from 'luxon';
import path from 'path';
import setJWT from '../Helpers/AuthHelpers.js';
import 'dotenv/config';


export default {
  Query: {

  },
  Mutation: {
    generateToken: async (_, { email }, context) => {

      if (!Validate.email(email)) {
        ThrowError('Invalid user');
      }

      let user;
      let token;
      let isMailSent;
      let isFinished;
      let html;

      try {
        user = await _MySQL.findOne('user', { email });
      } catch (error) {
        console.log(error);
      }

      if (!user) {
        ThrowError('Invalid user');
      }

      token = await TokenGenerator();

      try {
        html = fs.readFileSync(path.resolve('./Template/email.html'), 'utf-8')
        html = Replacer(html, { username: user.username, token })

        const emailOptions = {
          from: process.env.SMTP_USER,
          to: email,
          subject: 'LOGIN TOKEN',
          html
        };
        isMailSent = await sendEmail(emailOptions);
      } catch (error) {
        console.log(error);
      }

      if (!isMailSent) {
        ThrowError('Mail not sent');
      }

      const currentDateTime = DateTime.now()
      const expiry = currentDateTime.plus({ minutes: 10 }).toISO()

      try {
        isFinished = await _MySQL.insertOne('token', { user_id: user.id, token, expiration_date: expiry });
      } catch (error) {
        console.log(error);
      }

      if (!isFinished) {
        ThrowError('An error occured!')
      }

      return true;
    },
    login: async (_, { email, token }, context) => {

      try {
        const user = await _MySQL.findOne('user', { email });

        if (!user) {
          ThrowError('Invalid user');
        }

        const userTokens = await _MySQL.findMany('token', { user_id: user.id });

        let mostRecentToken = userTokens[userTokens.length - 1];

        let validToken = mostRecentToken.token == token;

        console.log(validToken, mostRecentToken, token);

        if (!validToken) {
          ThrowError('Invalid token');
        }

        const currentDateTime = DateTime.now();
        const expiryDateTime = DateTime.fromISO(mostRecentToken.expiration_date);

        if (currentDateTime > expiryDateTime) {
          ThrowError('Token expired');
        }


        let deleted

        userTokens.forEach(async (row) => {

          deleted = await _MySQL.deleteOne('token', { id: row.id });

        });



        let jwtToken

        if (!deleted) {
          jwtToken = await setJWT(user.id);
        }

        return jwtToken;

      } catch (error) {
        console.error(error);
        ThrowError('An error occurred');
      }
    }
  }
};
