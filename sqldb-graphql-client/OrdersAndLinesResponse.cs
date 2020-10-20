using System.Collections.Generic;

namespace graphqlclient
{
    public class OrdersAndLinesReponse
    {
        public OrderContent Order { get; set; }

        public class OrderContent
        {
            public int OrderID { get; set; }
            public System.DateTime OrderDate { get; set; }
            public int CustomerID { get; set; }

            public List<LineContent> orderlines { get; set; }

            public class LineContent
            {
                public int OrderLineID { get; set; }
                public int OrderID { get; set; }
                public int StockPlanID { get; set; }
                public int Quantity { get; set; }
            }
        }
    }
}