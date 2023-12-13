import _MySQL from '../Helpers/mySQL.js';
import Validate from '../Helpers/Validate.js';
import ThrowError from '../Helpers/ThrowError.js';

export default {
  Query: {
    getUser: async (_, { id }, context) => {
      if (!id) {
        ThrowError('invalid user ID');
      }

      try {
        const user = await _MySQL.findOne('user', { id });

        if (!user) {
          ThrowError('User not found');
        }

        return user;
      } catch (error) {
        console.error(error);
        ThrowError('An error occurred while retrieving user');
      }
    },

    getAllUsers: async () => {
      try {
        const users = await _MySQL.findMany('user', {});

        return users;
      } catch (error) {
        console.error(error);
        ThrowError('An error occurred while retrieving users');
      }
    },
  },
  Mutation: {
    createUser: async (_, { username, email, phone }, context) => {
      if (!Validate.email(email) || !Validate.phone(phone) || phone.length !== 11) {
        ThrowError('Invalid input');
      }

      try {
        const data = {
          username,
          email,
          phone,
        };

        let inserted = await _MySQL.insertOne('user', data);

        if (!inserted || inserted < 1) {
          ThrowError('An error occurred while creating user');
        }

        return {
          id: inserted,
          email,
          phone,
        };
      } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
          ThrowError('Duplicate user');
        } else {
          ThrowError('An error occurred while creating user');
        }
      }
    },

    updateUser: async (_, { id, username, email, phone }, context) => {
      if (!Validate.integer(id)) {
        ThrowError('Missing user ID');
      }

      if (!Validate.email(email) || !Validate.phone(phone) !== 11) {
        ThrowError('Invalid input');
      }

      try {
        const data = {
          username,
          email,
          phone
        };

        const affectedRows = await _MySQL.updateOne('user', data, { id });

        if (!affectedRows || affectedRows < 1) {
          ThrowError('User not found or update failed');
        }

        return {
          id,
          ...data,
        };
      } catch (error) {
        console.error(error);
        ThrowError('An error occurred while updating user');
      }
    },

    deleteUser: async (_, { id }, context) => {
      if (!id) {
        ThrowError('Missing user ID');
      }

      try {
        const deletedRows = await _MySQL.deleteOne('user', { id });

        if (!deletedRows || deletedRows < 1) {
          ThrowError('User not found or delete failed');
        }

        return {
          id,
        };
      } catch (error) {
        console.error(error);
        ThrowError('An error occurred while deleting user');
      }
    },
  },
};
