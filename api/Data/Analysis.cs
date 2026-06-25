namespace WebApi.Data;

public class Analysis
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ContractId { get; set; }

    // Each field stores a JSON-serialized string[] for SQLite compatibility
    public required string Summary { get; set; }
    public required string KeyObligations { get; set; }
    public required string Risks { get; set; }
    public required string RedFlags { get; set; }
    public required string Questions { get; set; }

    public string? Language { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
