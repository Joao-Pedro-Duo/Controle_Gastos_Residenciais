using Microsoft.EntityFrameworkCore;

using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options)
    {
    }

    public DbSet<Pessoa> Pessoas { get; set; }

    public DbSet<Transacao> Transacoes { get; set;} = null!;
}