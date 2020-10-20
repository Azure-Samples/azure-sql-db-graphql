using HotChocolate.Types;

namespace sqldb_graphql

{
  public class OrderQueriesType : ObjectType<OrderQueries>
  {
    protected override void Configure(IObjectTypeDescriptor<OrderQueries> descriptor)
    {
      base.Configure(descriptor);

      descriptor
        .Field(f => f.GetOrders(default)).UseFiltering();

      descriptor
        .Field(f => f.GetOrder(default, default))
        .Argument("orderID", a => a.Type<IntType>());
    }
  }
}
