using Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Planning
{
    public interface IPlanningDbContext
    {
        DbSet<Position> Positions { get;  }
        DbSet<Demand> Demands { get; }
        DbSet<Plan> Plan { get;  }
    }
}
