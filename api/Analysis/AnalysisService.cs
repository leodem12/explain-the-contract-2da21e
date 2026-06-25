using System.Text.Json;
using LlmAdapter;

namespace WebApi.Analysis;

public class AnalysisService(ILlmClient llm)
{
    private const string SystemPrompt = """
        You are a plain-language contract analyst. Respond ONLY with a single valid JSON object
        matching this schema (no markdown, no prose outside the JSON):
        {
          "summary":         ["string"],  // what the contract is about, parties, duration, key financials
          "keyObligations":  ["string"],  // obligations per party
          "risks":           ["string"],  // penalties, liability risks
          "redFlags":        ["string"],  // auto-renewal, hidden fees, unilateral changes, vague terms
          "questions":       ["string"],  // questions to ask before signing
          "language":        "string"     // detected language BCP-47 (e.g. "en", "fr")
        }
        Each array entry is one plain-language bullet. Use the contract's language unless instructed otherwise.
        """;

    // Upper bound on contract text injected into a prompt — limits prompt-injection
    // surface and runaway token cost. Mitigation is partial: full prevention of
    // prompt injection is not achievable with current LLM architectures.
    private const int MaxContractChars = 100_000;

    public async Task<ContractAnalysis> AnalyzeAsync(string contractText, string? language)
    {
        var lang = string.IsNullOrWhiteSpace(language) ? "" : $" Respond in {language}.";
        var safeText = Truncate(contractText);
        // Delimit user-supplied content so it cannot pose as instructions.
        var prompt =
            $"Analyse this contract:{lang}\n\n" +
            $"=== BEGIN CONTRACT TEXT ===\n{safeText}\n=== END CONTRACT TEXT ===";

        // Single retry: covers call failures, timeouts, and unparseable output.
        Exception? lastEx = null;
        for (int attempt = 0; attempt < 2; attempt++)
        {
            try
            {
                var json = await llm.CompleteJsonAsync(prompt, SystemPrompt);
                return Parse(json, language);
            }
            catch (LlmUnavailableException)
            {
                throw; // already wrapped — don't retry our own exception
            }
            catch (Exception ex)
            {
                lastEx = ex;
                // first attempt: loop to retry; second attempt: fall through
            }
        }

        throw new LlmUnavailableException("LLM request failed after retry.", lastEx);
    }

    private const string CompareSystemPrompt = """
        You are a contract comparison assistant. Respond ONLY with a single valid JSON object:
        {
          "differences": ["string"]  // key changed/added/removed terms between the two versions
        }
        Each entry is one plain-language bullet describing a meaningful change.
        Focus on terms that materially affect obligations, rights, or risks.
        """;

    public async Task<ComparisonResult> CompareAsync(
        string originalText, string newText, string? language)
    {
        var lang = string.IsNullOrWhiteSpace(language) ? "" : $" Respond in {language}.";
        var prompt =
            $"Compare these two contract versions and list the key differences.{lang}\n\n" +
            $"=== ORIGINAL VERSION ===\n{Truncate(originalText)}\n\n" +
            $"=== NEW VERSION ===\n{Truncate(newText)}";

        Exception? lastEx = null;
        for (int attempt = 0; attempt < 2; attempt++)
        {
            try
            {
                var json = await llm.CompleteJsonAsync(prompt, CompareSystemPrompt);
                return ParseComparison(json);
            }
            catch (LlmUnavailableException)
            {
                throw;
            }
            catch (Exception ex)
            {
                lastEx = ex;
            }
        }

        throw new LlmUnavailableException("LLM comparison request failed after retry.", lastEx);
    }

    private static string Truncate(string text) =>
        text.Length <= MaxContractChars ? text : text[..MaxContractChars];

    private static ComparisonResult ParseComparison(JsonElement root)
    {
        string[] diffs = [];
        if (root.TryGetProperty("differences", out var arr) &&
            arr.ValueKind == JsonValueKind.Array)
        {
            diffs = arr.EnumerateArray().Select(x => x.GetString() ?? "").ToArray();
        }
        return new ComparisonResult(diffs);
    }

    private static ContractAnalysis Parse(JsonElement root, string? requestedLanguage)
    {
        static string[] GetArray(JsonElement el, string primary, string? fallback = null)
        {
            if (TryArray(el, primary, out var arr)) return arr!;
            if (fallback is not null && TryArray(el, fallback, out arr)) return arr!;
            // scalar string → single-item array
            if (el.TryGetProperty(primary, out var s) && s.ValueKind == JsonValueKind.String)
                return [s.GetString() ?? ""];
            return [];
        }

        static bool TryArray(JsonElement el, string key, out string[]? result)
        {
            result = null;
            if (!el.TryGetProperty(key, out var v) || v.ValueKind != JsonValueKind.Array) return false;
            result = v.EnumerateArray().Select(x => x.GetString() ?? "").ToArray();
            return true;
        }

        // When an explicit language was requested, use it for the result.
        // When null, trust the LLM's self-reported language from the JSON.
        var detectedLang = !string.IsNullOrWhiteSpace(requestedLanguage)
            ? requestedLanguage
            : (root.TryGetProperty("language", out var langEl) && langEl.ValueKind == JsonValueKind.String
                ? langEl.GetString()
                : null);

        return new ContractAnalysis(
            GetArray(root, "summary"),
            GetArray(root, "keyObligations"),
            GetArray(root, "risks"),
            GetArray(root, "redFlags"),
            GetArray(root, "questions", "questionsToAsk"),  // graceful fallback for mock
            detectedLang);
    }
}
