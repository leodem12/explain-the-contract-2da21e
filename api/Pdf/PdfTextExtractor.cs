using System.Text;
using UglyToad.PdfPig;

namespace WebApi.Pdf;

/// <summary>Thrown when a PDF stream cannot yield extractable text.</summary>
public sealed class PdfExtractionException(string message) : Exception(message);

public class PdfTextExtractor
{
    /// <summary>
    /// Extracts concatenated text from a text-based PDF stream.
    /// Throws <see cref="PdfExtractionException"/> if the file is not a valid PDF
    /// or contains no extractable text.
    /// </summary>
    public virtual string ExtractText(Stream pdf)
    {
        PdfDocument? document = null;
        try
        {
            document = PdfDocument.Open(pdf);
        }
        catch (Exception ex)
        {
            throw new PdfExtractionException($"File is not a readable PDF: {ex.Message}");
        }

        using (document)
        {
            var sb = new StringBuilder();
            foreach (var page in document.GetPages())
            {
                var pageText = page.Text;
                if (!string.IsNullOrWhiteSpace(pageText))
                    sb.AppendLine(pageText);
            }

            var result = sb.ToString().Trim();
            if (result.Length == 0)
                throw new PdfExtractionException("The PDF contains no extractable text. Only text-based PDFs are supported.");

            return result;
        }
    }
}
