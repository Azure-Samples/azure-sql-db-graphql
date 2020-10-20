from models import Order as OrderModel
from models import OrderLine as OrderLineModel

import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType

class Order(SQLAlchemyObjectType):
    class Meta:
        model = OrderModel
        interfaces = (relay.Node, )


class OrderLine(SQLAlchemyObjectType):
    class Meta:
        model = OrderLineModel
        interfaces = (relay.Node, )

class Query(graphene.ObjectType):
    node = relay.Node.Field()
    # Allow only single column sorting
    Orders = SQLAlchemyConnectionField(Order.connection)
    # Allows sorting over multiple columns, by default over the primary key
    #OrderLines = SQLAlchemyConnectionField(OrderLine.connection)

schema = graphene.Schema(query=Query, types=[Order])
