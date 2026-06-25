using System.Security.Claims;
using System.Text;
using System.Text.Json;
using WebApi.Analysis;
using WebApi.Auth;
using WebApi.Data;
using WebApi.Export;
using WebApi.Pdf;
using DataAnalysis = WebApi.Data.Analysis;

namespace WebApi.Contracts;

public static class ContractEndpoints
{
    /// <summary>Maximum accepted upload size (20 MB) — guards against memory-exhaustion DoS.</summary>
    public const long MaxUploadBytes = 20L * 1024 * 1024;
    private const string MaxUploadError = "File exceeds the 20 MB limit.";

    public static IEndpointRouteBuilder MapContractEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/contracts").RequireAuthorization();

        group.MapPost("/", UploadContract);
        group.MapGet("/", ListContracts);
        group.MapGet("/{id:guid}", GetContract);
        group.MapPost("/{id:guid}/analyze", AnalyzeContract);
        group.MapPost("/{id:guid}/compare", CompareVersion);
        group.MapGet("/{id:guid}/export", ExportAnalysis);

        return app;
    }

    // POST /api/contracts — multipart (file + optional language)
    private static async Task<IResult> UploadContract(
        HttpRequest request,
        ClaimsPrincipal user,
        ContractService svc)
    {
        try { RoleAuthorization.RequireEditor(user); }
        catch (ForbiddenException) { return Results.Forbid(); }

        if (!request.HasFormContentType)
            return Results.BadRequest("Multipart form upload required.");

        var form = await request.ReadFormAsync();
        var file = form.Files.GetFile("file");
        if (file is null)
            return Results.BadRequest("No file supplied.");

        if (file.Length > MaxUploadBytes)
            return Results.BadRequest(new { error = MaxUploadError });

        var language = form["language"].FirstOrDefault();

        try
        {
            await using var stream = file.OpenReadStream();
            var contract = await svc.UploadAsync(
                ParseUserId(user), file.FileName, stream, language);

            return Results.Created(
                $"/api/contracts/{contract.Id}",
                new ContractDto(contract));
        }
        catch (PdfExtractionException)
        {
            return Results.BadRequest(new { error = "This PDF has no readable text. Only text-based PDFs are supported." });
        }
    }

    // GET /api/contracts — owner-scoped list
    private static async Task<IResult> ListContracts(
        ClaimsPrincipal user, ContractService svc)
    {
        var list = await svc.ListForUserAsync(ParseUserId(user));
        return Results.Ok(list.Select(c => new
        {
            c.Id, c.FileName, status = c.Status.ToString(), c.UploadedAt
        }));
    }

    // GET /api/contracts/{id} — returns contract + analysis (null if not yet analysed)
    private static async Task<IResult> GetContract(
        Guid id, ClaimsPrincipal user, ContractService svc)
    {
        try
        {
            var result = await svc.GetForUserAsync(ParseUserId(user), id);
            return Results.Ok(new ContractDetailDto(result.Contract, result.Analysis));
        }
        catch (NotFoundException)
        {
            return Results.NotFound();
        }
    }

    // POST /api/contracts/{id}/analyze — Editor-only; returns 200 Analysis or 404/503
    private static async Task<IResult> AnalyzeContract(
        Guid id,
        ClaimsPrincipal user,
        ContractService svc,
        HttpRequest request)
    {
        try { RoleAuthorization.RequireEditor(user); }
        catch (ForbiddenException) { return Results.Forbid(); }

        // Optional body: { "language": "fr" }
        string? language = null;
        if (request.ContentLength > 0 || request.Headers.ContentType.ToString().Contains("json"))
        {
            try
            {
                var body = await request.ReadFromJsonAsync<AnalyzeRequest>();
                language = body?.Language;
            }
            catch { /* no body or invalid JSON — language stays null */ }
        }

        try
        {
            var analysis = await svc.AnalyzeAsync(ParseUserId(user), id, language);
            return Results.Ok(new AnalysisDto(analysis));
        }
        catch (NotFoundException)
        {
            return Results.NotFound();
        }
        catch (LlmUnavailableException ex)
        {
            return Results.Problem(ex.Message, statusCode: 503);
        }
    }

    // POST /api/contracts/{id}/compare — multipart (file + optional language)
    private static async Task<IResult> CompareVersion(
        Guid id,
        HttpRequest request,
        ClaimsPrincipal user,
        ContractService svc)
    {
        try { RoleAuthorization.RequireEditor(user); }
        catch (ForbiddenException) { return Results.Forbid(); }

        if (!request.HasFormContentType)
            return Results.BadRequest("Multipart form upload required.");

        var form = await request.ReadFormAsync();
        var file = form.Files.GetFile("file");
        if (file is null)
            return Results.BadRequest("No file supplied.");

        if (file.Length > MaxUploadBytes)
            return Results.BadRequest(new { error = MaxUploadError });

        var language = form["language"].FirstOrDefault();

        try
        {
            await using var stream = file.OpenReadStream();
            var result = await svc.CompareAsync(
                ParseUserId(user), id, file.FileName, stream, language);

            return Results.Ok(new { result.Differences });
        }
        catch (NotFoundException)
        {
            return Results.NotFound();
        }
        catch (PdfExtractionException)
        {
            return Results.BadRequest(new { error = "This PDF has no readable text. Only text-based PDFs are supported." });
        }
        catch (LlmUnavailableException ex)
        {
            return Results.Problem(ex.Message, statusCode: 503);
        }
    }

    // GET /api/contracts/{id}/export?format=pdf|markdown
    private static async Task<IResult> ExportAnalysis(
        Guid id,
        string? format,
        ClaimsPrincipal user,
        ContractService contractSvc,
        ExportService exportSvc)
    {
        if (string.IsNullOrWhiteSpace(format) ||
            (format != "pdf" && format != "markdown"))
        {
            return Results.BadRequest(new { error = "format must be 'pdf' or 'markdown'" });
        }

        ContractWithAnalysis detail;
        try
        {
            detail = await contractSvc.GetForUserAsync(ParseUserId(user), id);
        }
        catch (NotFoundException)
        {
            return Results.NotFound();
        }

        if (detail.Analysis is null || detail.Contract.Status != ContractStatus.Analysed)
            return Results.NotFound(new { error = "Contract is not yet analysed." });

        var ca = ToContractAnalysis(detail.Analysis);
        var safeName = Path.GetFileNameWithoutExtension(detail.Contract.FileName);

        if (format == "pdf")
        {
            var bytes = exportSvc.ToPdf(ca);
            return Results.File(bytes, "application/pdf", $"{safeName}.pdf");
        }
        else
        {
            var md = exportSvc.ToMarkdown(ca);
            return Results.File(
                Encoding.UTF8.GetBytes(md), "text/markdown", $"{safeName}.md");
        }
    }

    private static ContractAnalysis ToContractAnalysis(DataAnalysis a)
    {
        static string[] Deser(string json) =>
            JsonSerializer.Deserialize<string[]>(json) ?? [];

        return new ContractAnalysis(
            Deser(a.Summary),
            Deser(a.KeyObligations),
            Deser(a.Risks),
            Deser(a.RedFlags),
            Deser(a.Questions),
            a.Language);
    }

    private static Guid ParseUserId(ClaimsPrincipal user)
    {
        var idStr = user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("User ID claim missing.");
        return Guid.Parse(idStr);
    }
}

// ── DTOs ─────────────────────────────────────────────────────────────────────

public record AnalyzeRequest(string? Language);

/// <summary>Combines contract metadata and its stored analysis (null if not yet analysed).</summary>
public record ContractDetailDto(ContractDto Contract, AnalysisDto? Analysis)
{
    public ContractDetailDto(Data.Contract c, DataAnalysis? a)
        : this(new ContractDto(c), a is null ? null : new AnalysisDto(a)) { }
}

/// <summary>Response DTO — never exposes extractedText.</summary>
public record ContractDto(
    Guid Id,
    string FileName,
    string Status,
    string? Language,
    DateTime UploadedAt)
{
    public ContractDto(Data.Contract c)
        : this(c.Id, c.FileName, c.Status.ToString(), c.Language, c.UploadedAt) { }
}

/// <summary>Serializable projection of the Analysis entity; arrays deserialized from JSON.</summary>
public record AnalysisDto(
    Guid Id,
    Guid ContractId,
    string[] Summary,
    string[] KeyObligations,
    string[] Risks,
    string[] RedFlags,
    string[] Questions,
    string? Language,
    DateTime CreatedAt)
{
    public AnalysisDto(DataAnalysis a)
        : this(
            a.Id, a.ContractId,
            Deser(a.Summary), Deser(a.KeyObligations),
            Deser(a.Risks), Deser(a.RedFlags),
            Deser(a.Questions), a.Language, a.CreatedAt) { }

    private static string[] Deser(string json) =>
        JsonSerializer.Deserialize<string[]>(json) ?? [];
}
