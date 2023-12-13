const typeDefs = `#graphql
  scalar JSON

  type Query {
    getUser(id: Int!):JSON
    getAllUsers:JSON
  }

  type Mutation {
    createUser(username:String! ,email: String!, phone: String!):JSON
    updateUser(id: Int!, username:String ,email: String, phone: String):JSON
    deleteUser(id: Int!):JSON

    generateToken(email: String!): Boolean
    login(email: String!, token:Int!): JSON
  }
`;

export default typeDefs;
