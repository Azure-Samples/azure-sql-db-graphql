// src/schema.js

const { gql } = require('apollo-server')

const typeDefs = gql`
    type Order {
        OrderID: Int!
        CustomerID: Int!
        OrderDate: String!
        orderlines: [OrderLine!]!
      }

    type OrderLine {
        OrderLineID: Int!
        OrderID: Int!
        StockItemID: Int!
        Quantity: Int!
        order: Order!
    }

    type OrderLines {
        count: Int!
        orderlines: [OrderLine!]!
    }

    type Query {
        Order(OrderID: Int!): Order
        allOrders: [Order!]!
        OrderLine(OrderLineID: Int!): OrderLine
        OrderLines(OrderID: Int!): OrderLines!
    }

    type Mutation {
        createOrderLine(OrderID: Int!, OrderDate: String!, StockItemID: Int!,Quantity: Int!): OrderLine!
    }
`

module.exports = typeDefs