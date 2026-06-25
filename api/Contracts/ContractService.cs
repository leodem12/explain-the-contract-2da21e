using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using WebApi.Analysis;
using WebApi.Data;
using WebApi.Pdf;
using DataAnalysis = WebApi.Data.Analysis;
using ComparisonResult = WebApi.Analysis.ComparisonResult;

namespace WebApi.Contracts;

public record ContractSummary(Guid Id, string FileName, ContractStatus Status, DateTime UploadedAt);

public record ContractWithAnalysis(Contract Contract, DataAnalysis? Analysis);

public class ContractService(AppDbContext db, PdfTextExtractor extractor, AnalysisService analysisSvc)
{
    /// <summary>
    /// Extracts text from the PDF, persists a new Contract with status=Extracted,
    /// and returns it. PdfExtractionException propagates to the caller.
    /// </summary>
    public async Task<Contract> UploadAsync(
        Guid userId, string fileName, Stream pdf, string? language)
    {
        // PdfExtractionException propagates — caller maps to 400
        var text = extractor.ExtractText(pdf);

        var contract = new Contract
        {
            OwnerUserId = userId,
            FileName = fileName,
            ExtractedText = text,
            Language = language,
            Status = ContractStatus.Extracted,
        };

        db.Contracts.Add(contract);
        await db.SaveChangesAsync();
        return contract;
    }

    public async Task<IReadOnlyList<ContractSummary>> ListForUserAsync(Guid userId)
    {
        return await db.Contracts
            .Where(c => c.OwnerUserId == userId)
            .OrderByDescending(c => c.UploadedAt)
            .Select(c => new ContractSummary(c.Id, c.FileName, c.Status, c.UploadedAt))
            .ToListAsync();
    }

    /// <summary>
    /// Calls AnalysisService, persists the Analysis, and sets contract status=Analysed.
    /// On LLM failure: sets status=AnalysisFailed, persists, and rethrows LlmUnavailableException.
    /// </summary>
    public async Task<DataAnalysis> AnalyzeAsync(Guid userId, Guid contractId, string? language)
    {
        var contract = await db.Contracts
            .FirstOrDefaultAsync(c => c.Id == contractId && c.OwnerUserId == userId)
            ?? throw new NotFoundException("Contract not found.");

        ContractAnalysis ca;
        try
        {
            ca = await analysisSvc.AnalyzeAsync(
                contract.ExtractedText, language ?? contract.Language);
        }
        catch (LlmUnavailableException)
        {
            contract.Status = ContractStatus.AnalysisFailed;
            await db.SaveChangesAsync();
            throw;
        }

        // Remove any previous analysis (re-analysis / retry path)
        var existing = await db.Analyses
            .Where(a => a.ContractId == contractId)
            .ToListAsync();
        db.Analyses.RemoveRange(existing);

        var analysis = new DataAnalysis
        {
            ContractId = contractId,
            Summary        = JsonSerializer.Serialize(ca.Summary),
            KeyObligations = JsonSerializer.Serialize(ca.KeyObligations),
            Risks          = JsonSerializer.Serialize(ca.Risks),
            RedFlags       = JsonSerializer.Serialize(ca.RedFlags),
            Questions      = JsonSerializer.Serialize(ca.Questions),
            Language       = ca.Language,
        };
        db.Analyses.Add(analysis);
        contract.Status = ContractStatus.Analysed;
        await db.SaveChangesAsync();
        return analysis;
    }

    public async Task<ComparisonResult> CompareAsync(
        Guid userId, Guid contractId, string newFileName, Stream newPdf, string? language)
    {
        var original = await db.Contracts
            .FirstOrDefaultAsync(c => c.Id == contractId && c.OwnerUserId == userId)
            ?? throw new NotFoundException("Contract not found.");

        // PdfExtractionException propagates — caller maps to 400
        var newText = extractor.ExtractText(newPdf);

        // Persist the new version linked to the original
        var newVersion = new Contract
        {
            OwnerUserId = userId,
            FileName = newFileName,
            ExtractedText = newText,
            Language = language ?? original.Language,
            Status = ContractStatus.Extracted,
            Version = original.Version + 1,
            ParentContractId = original.Id,
        };
        db.Contracts.Add(newVersion);
        await db.SaveChangesAsync();

        return await analysisSvc.CompareAsync(original.ExtractedText, newText, language);
    }

    public async Task<ContractWithAnalysis> GetForUserAsync(Guid userId, Guid contractId)
    {
        var contract = await db.Contracts
            .FirstOrDefaultAsync(c => c.Id == contractId && c.OwnerUserId == userId)
            ?? throw new NotFoundException("Contract not found.");

        var analysis = await db.Analyses
            .FirstOrDefaultAsync(a => a.ContractId == contractId);

        return new ContractWithAnalysis(contract, analysis);
    }
}

public sealed class NotFoundException(string message) : Exception(message);
