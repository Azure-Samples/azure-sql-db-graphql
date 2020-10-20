const { ApolloServer } = require('apollo-server-azure-functions')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const models = require('../models')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models }
})

exports.graphqlHandler = server.createHandler();

// server
//   .listen()
//   .then(({ url }) => console.log('🚀 Server ready at http://localhost:4000'))