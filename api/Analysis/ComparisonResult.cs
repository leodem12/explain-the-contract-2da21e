namespace WebApi.Analysis;

/// <summary>LLM key-differences summary between two contract versions.</summary>
public record ComparisonResult(string[] Differences);
