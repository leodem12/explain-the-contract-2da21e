using System.Text.Json;

namespace LlmAdapter;

/// <summary>
/// Minimal vendor-agnostic surface. Keep it small: one text-in/text-out call
/// covers the vast majority of integration points. Add a structured method
/// only when a real consumer needs it.
/// </summary>
public interface ILlmClient
{
    /// <summary>Return the model's text response.</summary>
    Task<string> CompleteAsync(
        string prompt,
        string? system = null,
        double temperature = 0.2,
        CancellationToken cancellationToken = default);
}

public static class LlmClientExtensions
{
    /// <summary>Convenience: ask for JSON, parse strictly, throw on garbage.</summary>
    public static async Task<JsonElement> CompleteJsonAsync(
        this ILlmClient client,
        string prompt,
        string? system = null,
        CancellationToken cancellationToken = default)
    {
        var sys = ((system ?? "") + "\nRespond with a single valid JSON object and nothing else.").Trim();
        var text = (await client.CompleteAsync(prompt, sys, 0.0, cancellationToken)).Trim();

        if (text.StartsWith("```"))
        {
            text = text.Trim('`');
            var start = text.IndexOf('{');
            var end = text.LastIndexOf('}');
            if (start >= 0 && end >= start)
                text = text[start..(end + 1)];
        }

        using var doc = JsonDocument.Parse(text);
        return doc.RootElement.Clone();
    }
}
