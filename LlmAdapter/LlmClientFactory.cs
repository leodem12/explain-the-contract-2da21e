namespace LlmAdapter;

/// <summary>
/// Provider selection is configuration, not architecture. Default to the offline
/// mock so tests and demos run with zero keys.
/// Set LLM_PROVIDER=gemini (+ GEMINI_API_KEY) to use the real provider.
/// </summary>
public static class LlmClientFactory
{
    public static ILlmClient Create(string? provider = null)
    {
        provider ??= Environment.GetEnvironmentVariable("LLM_PROVIDER") ?? "mock";
        return provider.ToLowerInvariant() switch
        {
            "gemini" => new GeminiClient(),
            "mock" => new MockLlmClient(),
            _ => throw new ArgumentException($"unknown LLM provider: {provider}", nameof(provider)),
        };
    }
}
