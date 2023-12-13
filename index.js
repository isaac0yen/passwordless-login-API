import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './typedefs.js'
import resolvers from './resolvers/index.js'
import { mySQLConnect } from './Helpers/mySQL.js';


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await mySQLConnect();

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);