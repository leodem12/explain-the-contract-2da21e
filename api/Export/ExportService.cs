using System.Text;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using WebApi.Analysis;

namespace WebApi.Export;

public class ExportService
{
    static ExportService()
    {
        // Community licence — free for non-commercial/open-source use.
        QuestPDF.Settings.License = LicenseType.Community;
    }

    /// <summary>Renders the five-section analysis to a PDF byte array.</summary>
    public byte[] ToPdf(ContractAnalysis analysis)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(40);
                page.DefaultTextStyle(t => t.FontSize(11));
                page.Content().Column(col =>
                {
                    col.Spacing(16);
                    AddSection(col, "Summary",                        analysis.Summary);
                    AddSection(col, "Key Obligations",                analysis.KeyObligations);
                    AddSection(col, "Risks",                          analysis.Risks);
                    AddSection(col, "Red Flags",                      analysis.RedFlags);
                    AddSection(col, "Questions to Ask Before Signing", analysis.Questions);
                });
            });
        }).GeneratePdf();
    }

    private static void AddSection(ColumnDescriptor col, string title, string[] items)
    {
        col.Item().Text(title).FontSize(14).Bold();
        foreach (var item in items)
            col.Item().Text($"• {item}");
    }

    /// <summary>Renders the five-section analysis to a Markdown string.</summary>
    public string ToMarkdown(ContractAnalysis analysis)
    {
        var sb = new StringBuilder();
        AppendSection(sb, "Summary",                        analysis.Summary);
        AppendSection(sb, "Key Obligations",                analysis.KeyObligations);
        AppendSection(sb, "Risks",                          analysis.Risks);
        AppendSection(sb, "Red Flags",                      analysis.RedFlags);
        AppendSection(sb, "Questions to Ask Before Signing", analysis.Questions);
        return sb.ToString();
    }

    private static void AppendSection(StringBuilder sb, string title, string[] items)
    {
        sb.AppendLine($"## {title}");
        sb.AppendLine();
        foreach (var item in items)
            sb.AppendLine($"- {item}");
        sb.AppendLine();
    }
}
