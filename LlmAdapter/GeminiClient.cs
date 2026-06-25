using System.Net.Http.Json;
using System.Text.Json;

namespace LlmAdapter;

/// <summary>
/// Google Gemini via the public REST endpoint (no vendor SDK dependency, to
/// keep the adapter thin). Model from GEMINI_MODEL (default: a cheap
/// Flash-class model); key from GEMINI_API_KEY. Both env-driven so the
/// architecture can pin them without code changes.
/// </summary>
public sealed class GeminiClient : ILlmClient
{
    private const string DefaultModel = "gemini-2.5-flash";
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly string _model;

    public GeminiClient(HttpClient? http = null, string? apiKey = null, string? model = null)
    {
        _http = http ?? new HttpClient();
        _apiKey = apiKey
            ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY")
            ?? throw new InvalidOperationException("GEMINI_API_KEY is not set.");
        _model = model
            ?? Environment.GetEnvironmentVariable("GEMINI_MODEL")
            ?? DefaultModel;
    }

    public async Task<string> CompleteAsync(
        string prompt,
        string? system = null,
        double temperature = 0.2,
        CancellationToken cancellationToken = default)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent?key={_apiKey}";

        var body = new
        {
            contents = new[] { new { parts = new[] { new { text = prompt } } } },
            systemInstruction = system is null
                ? null
                : new { parts = new[] { new { text = system } } },
            generationConfig = new { temperature }
        };

        using var resp = await _http.PostAsJsonAsync(url, body, cancellationToken);
        resp.EnsureSuccessStatusCode();

        using var doc = JsonDocument.Parse(await resp.Content.ReadAsStringAsync(cancellationToken));
        var text = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        if (string.IsNullOrEmpty(text))
            throw new InvalidOperationException("Gemini returned an empty response.");
        return text;
    }
}
