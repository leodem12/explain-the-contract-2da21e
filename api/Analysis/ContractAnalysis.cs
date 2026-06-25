namespace WebApi.Analysis;

/// <summary>Five-section plain-language breakdown produced by AnalysisService.</summary>
public record ContractAnalysis(
    string[] Summary,
    string[] KeyObligations,
    string[] Risks,
    string[] RedFlags,
    string[] Questions,
    string? Language);

/// <summary>Thrown when the LLM fails, times out, or returns unparseable output.</summary>
public sealed class LlmUnavailableException(string message, Exception? inner = null)
    : Exception(message, inner);
