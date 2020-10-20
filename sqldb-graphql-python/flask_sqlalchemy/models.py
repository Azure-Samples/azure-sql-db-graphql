from database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import backref, relationship

from sqlalchemy.ext.declarative import declarative_base


class Order(Base):
    __tablename__ = 'Orders'
    __table_args__ = {'schema' : 'Sales'}
    OrderID = Column(Integer, primary_key=True)
    OrderDate = Column(DateTime)
    CustomerID = Column(Integer)

class OrderLine(Base):
    __tablename__ = 'OrderLines'
    __table_args__ = {'schema' : 'Sales'}
    OrderLineID = Column(Integer, primary_key=True)
    StockItemID = Column(Integer)
    OrderID = Column(Integer, ForeignKey('Order.OrderID'))
    Order = relationship(
        Order,
        backref=backref('Orders',
                        uselist=True,
                        cascade='delete,all'))