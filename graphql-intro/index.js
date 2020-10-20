const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type order {
    id: Int!
    customer: String
    orderlines: [orderline]
  }

  type orderline {
    id: Int!
    quantity: Int
    product: String
  }

  type Query {
    orders: [order]
    order(id: Int!): order
  }
`;

const orders = [
    {
        id: 1,
        customer: 'Customer A',
        orderlines: [
            {
                id: 1,
                quantity: 2,
                product: "Product XYZ"
            },
            {
                id: 2,
                quantity: 3,
                product: "Product ABC"
            },
        ]
    },
    {
        id: 2,
        customer: 'Customer B',
        orderlines: [
            {
                id: 1,
                quantity: 5,
                product: "Product XYZ"
            },
            {
                id: 2,
                quantity: 1,
                product: "Product ABC"
            },
        ]
    }
];

    const getOrderByID = ({ id }) => {
    return orders.find(p => p.id == id);
  }

const resolvers = {
    Query: {
      orders: () => orders,
      order: (_, { id }) => getOrderByID({ id: id })
    }
  };

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});