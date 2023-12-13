import user from "./user.js";
import token from "./token.js";


const resolvers = {
  Query: {
    ...user.Query,
    ...token.Query,
  },
  Mutation:{
    ...user.Mutation,
    ...token.Mutation
  }
};

export default resolvers;