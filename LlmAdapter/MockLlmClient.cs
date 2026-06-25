namespace LlmAdapter;

/// <summary>
/// Deterministic stand-in for tests and offline demos — no API key, no network.
/// </summary>
public sealed class MockLlmClient : ILlmClient
{
    private readonly string _canned;
    public List<(string Prompt, string? System, double Temperature)> Calls { get; } = new();

    public MockLlmClient(string canned = """
        {
          "summary": ["This is a mock contract summary for offline testing."],
          "keyObligations": ["Party A must deliver by agreed deadline.", "Party B must make payment within 30 days."],
          "risks": ["Penalty clauses may apply for late delivery.", "Jurisdiction not explicitly stated."],
          "redFlags": ["Unlimited liability clause on page 3.", "Auto-renewal with no notice period."],
          "questionsToAsk": ["What is the governing law?", "Are termination rights clearly defined?"]
        }
        """) => _canned = canned;

    public Task<string> CompleteAsync(
        string prompt,
        string? system = null,
        double temperature = 0.2,
        CancellationToken cancellationToken = default)
    {
        Calls.Add((prompt, system, temperature));
        return Task.FromResult(_canned);
    }
}
