using Microsoft.EntityFrameworkCore;
using Model;

namespace JmeterPortalAPI.PersistenceHandler{
    public class DataContext : DbContext{
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DataContext(){}
        public DbSet<TestRun> TestRuns {get; set;}
    }
}