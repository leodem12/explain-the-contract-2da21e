using System.Text.Json;
using LlmAdapter;
using WebApi.Analysis;

namespace WebApi.Tests;

/// <summary>
/// S4 / S5 / S6 — AnalysisService with the mock LLM client (no API keys, no network).
/// Also covers the LLM adapter seam per pipeline test requirements.
/// </summary>
public class AnalysisServiceTests
{
    private static AnalysisService BuildWithMock(MockLlmClient mock) => new(mock);

    // ── Happy path / five sections (S4, happy-path unit level) ───────────────

    [Fact]
    public async Task AnalyzeAsync_MockClient_ReturnsAllFiveSections()
    {
        var mock = new MockLlmClient();
        var svc = BuildWithMock(mock);

        var result = await svc.AnalyzeAsync("Some contract text.", null);

        Assert.NotEmpty(result.Summary);
        Assert.NotEmpty(result.KeyObligations);
        Assert.NotEmpty(result.Risks);
        Assert.NotEmpty(result.RedFlags);
        Assert.NotEmpty(result.Questions);
    }

    [Fact]
    public async Task AnalyzeAsync_MockClient_CallsLlmExactlyOnce()
    {
        var mock = new MockLlmClient();
        var svc = BuildWithMock(mock);

        await svc.AnalyzeAsync("Contract text.", null);

        Assert.Single(mock.Calls);
    }

    // ── Language selection (S5) ───────────────────────────────────────────────

    [Fact]
    public async Task AnalyzeAsync_WithRequestedLanguage_UsesRequestedLanguage()
    {
        var mock = new MockLlmClient();
        var svc = BuildWithMock(mock);

        var result = await svc.AnalyzeAsync("Contract text.", "fr");

        // requestedLanguage overrides LLM self-report
        Assert.Equal("fr", result.Language);
    }

    [Fact]
    public async Task AnalyzeAsync_WithNullLanguage_UsesLlmDetectedLanguage()
    {
        // Mock returns no "language" field; result.Language should be null/empty
        var mock = new MockLlmClient("""
            {
              "summary": ["Summary."],
              "keyObligations": ["Obligation."],
              "risks": ["Risk."],
              "redFlags": ["Red flag."],
              "questions": ["Question?"]
            }
            """);
        var svc = BuildWithMock(mock);

        var result = await svc.AnalyzeAsync("Contract text.", null);

        Assert.Null(result.Language);
    }

    // ── LLM failure handling (S6) ─────────────────────────────────────────────

    [Fact]
    public async Task AnalyzeAsync_WhenLlmUnavailable_RethrowsImmediately()
    {
        // Client that always throws LlmUnavailableException — must not be swallowed
        var mock = new ThrowingLlmClient(new LlmUnavailableException("LLM down"));
        var svc = new AnalysisService(mock);

        var ex = await Assert.ThrowsAsync<LlmUnavailableException>(
            () => svc.AnalyzeAsync("text", null));
        Assert.Equal("LLM down", ex.Message);
        // Only one call — no retries after LlmUnavailableException
        Assert.Equal(1, mock.CallCount);
    }

    [Fact]
    public async Task AnalyzeAsync_WhenParseFailsTwice_WrapsInLlmUnavailableException()
    {
        // Client returns invalid JSON so Parse throws — after 2 attempts wraps in LlmUnavailableException
        var mock = new MockLlmClient("""{"broken": """);
        var svc = BuildWithMock(mock);

        await Assert.ThrowsAsync<LlmUnavailableException>(
            () => svc.AnalyzeAsync("text", null));
        // Exactly 2 attempts
        Assert.Equal(2, mock.Calls.Count);
    }

    // ── Compare (S9) ─────────────────────────────────────────────────────────

    [Fact]
    public async Task CompareAsync_MockClient_ReturnsDifferencesList()
    {
        var mock = new MockLlmClient("""
            {"differences": ["Clause 3 payment term changed from 30 to 60 days."]}
            """);
        var svc = BuildWithMock(mock);

        var result = await svc.CompareAsync("original text", "new text", null);

        Assert.Single(result.Differences);
        Assert.Contains("30 to 60 days", result.Differences[0]);
    }

    [Fact]
    public async Task CompareAsync_WhenLlmUnavailable_RethrowsImmediately()
    {
        var mock = new ThrowingLlmClient(new LlmUnavailableException("down"));
        var svc = new AnalysisService(mock);

        await Assert.ThrowsAsync<LlmUnavailableException>(
            () => svc.CompareAsync("v1", "v2", null));
        Assert.Equal(1, mock.CallCount);
    }

    // ── Truncation guard ─────────────────────────────────────────────────────

    [Fact]
    public async Task AnalyzeAsync_VeryLongText_TruncatedBefore100kInPrompt()
    {
        var longText = new string('A', 120_000);
        var mock = new MockLlmClient();
        var svc = BuildWithMock(mock);

        await svc.AnalyzeAsync(longText, null);

        // The prompt sent to the LLM must be shorter than 120k
        var (prompt, _, _) = mock.Calls[0];
        Assert.True(prompt.Length < 120_000,
            $"Expected truncated prompt, got {prompt.Length} chars");
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private sealed class ThrowingLlmClient(Exception ex) : ILlmClient
    {
        public int CallCount { get; private set; }

        public Task<string> CompleteAsync(
            string prompt, string? system, double temperature,
            CancellationToken cancellationToken)
        {
            CallCount++;
            throw ex;
        }
    }
}
