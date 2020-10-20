const resolvers = {
    Query: {
        async Order (root, { OrderID }, { models }) {
              return models.Order.findOne({ where: {OrderID: OrderID}, include: { model: models.OrderLine, as: 'Lines' }})
        },
        async allOrders (root, args, { models }) {
              return models.Order.findAll()
        },
        async OrderLine (root, { OrderLineID }, { models }) {
              return models.OrderLine.findOne({ where: {OrderLineID: OrderLineID} })
        },
        async OrderLines (root, args, { models }) {
            return models.OrderLine.findAndCountAll({ where: args }).then(result => {
                return {
                  count: result.count,
                  orderlines: result.rows
                }
              })
        }
    },
    Mutation: {
        async createOrderLine (root, { OrderID, OrderDate, StockItemID,Quantity }, { models }) {
            return models.User.create({
                OrderID,
                OrderDate,
                StockItemID,
                Quantity
              })
        }
    },
    Order: {
        orderlines: (parent, args, context, info) => parent.getLines()
    },
    // OrderLine: {
    //     order (OrderLine) {
    //         return OrderLine.getOrder()
    //     }
    // }
}

module.exports = resolvers