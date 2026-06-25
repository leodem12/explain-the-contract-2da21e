using WebApi.Pdf;

namespace WebApi.Tests.Helpers;

/// <summary>
/// Overrides ExtractText (virtual) so ContractService tests need no real PDF bytes.
/// </summary>
internal sealed class FakePdfExtractor(string? text = "Sample contract text.", bool shouldFail = false)
    : PdfTextExtractor
{
    public override string ExtractText(Stream pdf) =>
        shouldFail
            ? throw new PdfExtractionException("Test: unreadable PDF")
            : text ?? "Sample contract text.";
}
