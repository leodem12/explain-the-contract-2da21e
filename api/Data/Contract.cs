namespace WebApi.Data;

public enum ContractStatus { Extracted, Analysed, AnalysisFailed }

public class Contract
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OwnerUserId { get; set; }
    public required string FileName { get; set; }
    public required string ExtractedText { get; set; }
    public string? Language { get; set; }
    public ContractStatus Status { get; set; } = ContractStatus.Extracted;
    public int Version { get; set; } = 1;
    public Guid? ParentContractId { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
