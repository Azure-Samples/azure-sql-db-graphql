using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;

namespace sqldb_graphql
{
    public class OrderQueries
    {
        [UseSelection] // <--- creates the projections on the database
        [UseSorting]
        public IEnumerable<Order> GetOrders([Service]WwiContext wwiContext) =>
           wwiContext
           .Orders
           .AsNoTracking()
           .AsQueryable();
    
        [UseSelection]
        public IEnumerable<Order> GetOrder([Service]WwiContext wwiContext, int orderID) =>
           wwiContext
           .Orders
           .AsNoTracking()
           .Where(o => o.OrderID == orderID)
           .AsQueryable();           
    }
}