using Microsoft.EntityFrameworkCore;


namespace sqldb_graphql
{
    public class WwiContext : DbContext
    {
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderLine> OrderLines { get; set; }
        public DbSet<Customer> Customers { get; set; }

        public WwiContext(DbContextOptions<WwiContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>()
                    .ToTable("Orders", schema: "Sales");
            modelBuilder.Entity<OrderLine>()
                    .ToTable("OrderLines", schema: "Sales");
            modelBuilder.Entity<Customer>()
                    .ToTable("Customers", schema: "Sales");
        }
    }
}