using WebApi.Analysis;
using WebApi.Export;

namespace WebApi.Tests;

/// <summary>S12 — ExportService produces correctly structured PDF and Markdown output.</summary>
public class ExportServiceTests
{
    private static readonly ContractAnalysis SampleAnalysis = new(
        Summary:        ["This is a service agreement between Party A and Party B."],
        KeyObligations: ["Party A delivers software by Q2.", "Party B pays £5,000 on delivery."],
        Risks:          ["Late-delivery penalties up to 20% of contract value."],
        RedFlags:       ["Unlimited liability clause on page 5.", "Auto-renewal with 90-day notice."],
        Questions:      ["What is the jurisdiction?", "Are IP rights clearly assigned?"],
        Language:       "en");

    private static ExportService Build() => new();

    // ── Markdown (S12 — Markdown path) ───────────────────────────────────────

    [Fact]
    public void ToMarkdown_ContainsAllFiveSectionHeaders()
    {
        var md = Build().ToMarkdown(SampleAnalysis);

        Assert.Contains("## Summary",                        md);
        Assert.Contains("## Key Obligations",                md);
        Assert.Contains("## Risks",                          md);
        Assert.Contains("## Red Flags",                      md);
        Assert.Contains("## Questions to Ask Before Signing", md);
    }

    [Fact]
    public void ToMarkdown_ContainsSampleContent()
    {
        var md = Build().ToMarkdown(SampleAnalysis);

        Assert.Contains("Party A delivers software", md);
        Assert.Contains("Auto-renewal with 90-day notice", md);
        Assert.Contains("What is the jurisdiction?", md);
    }

    [Fact]
    public void ToMarkdown_UsesMarkdownListItems()
    {
        var md = Build().ToMarkdown(SampleAnalysis);
        // Each bullet starts with "- "
        Assert.Contains("- This is a service agreement", md);
    }

    // ── PDF (S12 — PDF path) ──────────────────────────────────────────────────

    [Fact]
    public void ToPdf_ReturnsNonEmptyByteArray()
    {
        var bytes = Build().ToPdf(SampleAnalysis);

        Assert.NotNull(bytes);
        Assert.True(bytes.Length > 0, "PDF byte array should not be empty");
    }

    [Fact]
    public void ToPdf_StartsWithPdfMagicBytes()
    {
        var bytes = Build().ToPdf(SampleAnalysis);

        // All PDFs start with %PDF
        Assert.Equal((byte)'%', bytes[0]);
        Assert.Equal((byte)'P', bytes[1]);
        Assert.Equal((byte)'D', bytes[2]);
        Assert.Equal((byte)'F', bytes[3]);
    }

    // ── Empty sections edge case ──────────────────────────────────────────────

    [Fact]
    public void ToMarkdown_WithEmptyArrays_StillContainsHeaders()
    {
        var empty = new ContractAnalysis([], [], [], [], [], null);
        var md = Build().ToMarkdown(empty);

        Assert.Contains("## Summary",     md);
        Assert.Contains("## Key Obligations", md);
        Assert.Contains("## Risks",       md);
        Assert.Contains("## Red Flags",   md);
        Assert.Contains("## Questions to Ask Before Signing", md);
    }
}
