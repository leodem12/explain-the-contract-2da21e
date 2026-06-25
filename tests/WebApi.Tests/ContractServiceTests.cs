using LlmAdapter;
using WebApi.Analysis;
using WebApi.Contracts;
using WebApi.Data;
using WebApi.Tests.Helpers;

namespace WebApi.Tests;

/// <summary>
/// S3 / S6 / S7 / S8 / S9 — ContractService: upload, analyse, list, get, compare.
/// Uses FakePdfExtractor and MockLlmClient so no real PDF bytes or LLM keys are needed.
/// </summary>
public class ContractServiceTests
{
    private static (ContractService svc, AppDbContext db) Build(
        string? fakeText = "Contract body.", bool pdfFails = false,
        ILlmClient? llm = null)
    {
        var db = DbHelper.CreateDb();
        var extractor = new FakePdfExtractor(fakeText, pdfFails);
        var analysisSvc = new AnalysisService(llm ?? new MockLlmClient());
        return (new ContractService(db, extractor, analysisSvc), db);
    }

    private static async Task<(Guid userId, Guid contractId)> SeedContractAsync(
        AppDbContext db, Guid? ownerId = null)
    {
        var uid = ownerId ?? Guid.NewGuid();
        var contract = new Contract
        {
            OwnerUserId = uid,
            FileName = "test.pdf",
            ExtractedText = "Sample extracted text.",
            Status = ContractStatus.Extracted,
        };
        db.Contracts.Add(contract);
        await db.SaveChangesAsync();
        return (uid, contract.Id);
    }

    // ── Upload (S3) ──────────────────────────────────────────────────────────

    [Fact]
    public async Task UploadAsync_ValidPdf_PersistsContractWithStatusExtracted()
    {
        var (svc, db) = Build();
        var userId = Guid.NewGuid();

        var contract = await svc.UploadAsync(userId, "doc.pdf", Stream.Null, null);

        Assert.Equal(ContractStatus.Extracted, contract.Status);
        Assert.Equal(userId, contract.OwnerUserId);
        Assert.Equal("Contract body.", contract.ExtractedText);
        Assert.Equal(1, db.Contracts.Count());
    }

    [Fact]
    public async Task UploadAsync_InvalidPdf_ThrowsPdfExtractionException()
    {
        var (svc, _) = Build(pdfFails: true);
        var ex = await Assert.ThrowsAsync<WebApi.Pdf.PdfExtractionException>(
            () => svc.UploadAsync(Guid.NewGuid(), "bad.pdf", Stream.Null, null));
        Assert.NotNull(ex);
    }

    // ── Analyse (S4 / S6) ────────────────────────────────────────────────────

    [Fact]
    public async Task AnalyzeAsync_ExtractedContract_SetsStatusAnalysed()
    {
        var (svc, db) = Build();
        var (userId, contractId) = await SeedContractAsync(db);

        await svc.AnalyzeAsync(userId, contractId, null);

        var contract = db.Contracts.Find(contractId)!;
        Assert.Equal(ContractStatus.Analysed, contract.Status);
        Assert.Equal(1, db.Analyses.Count());
    }

    [Fact]
    public async Task AnalyzeAsync_LlmFails_SetsStatusAnalysisFailed()
    {
        var failingLlm = new AlwaysFailingLlmClient();
        var (svc, db) = Build(llm: failingLlm);
        var (userId, contractId) = await SeedContractAsync(db);

        await Assert.ThrowsAsync<LlmUnavailableException>(
            () => svc.AnalyzeAsync(userId, contractId, null));

        var contract = db.Contracts.Find(contractId)!;
        Assert.Equal(ContractStatus.AnalysisFailed, contract.Status);
    }

    [Fact]
    public async Task AnalyzeAsync_LlmFails_RetainsExtractedText()
    {
        // R11: contract must be retryable — ExtractedText preserved on failure
        var failingLlm = new AlwaysFailingLlmClient();
        var (svc, db) = Build(llm: failingLlm);
        var (userId, contractId) = await SeedContractAsync(db);

        await Assert.ThrowsAsync<LlmUnavailableException>(
            () => svc.AnalyzeAsync(userId, contractId, null));

        var contract = db.Contracts.Find(contractId)!;
        Assert.NotEmpty(contract.ExtractedText);
    }

    [Fact]
    public async Task AnalyzeAsync_NonOwnedContract_ThrowsNotFoundException()
    {
        var (svc, db) = Build();
        var (_, contractId) = await SeedContractAsync(db);
        var differentUser = Guid.NewGuid();

        await Assert.ThrowsAsync<NotFoundException>(
            () => svc.AnalyzeAsync(differentUser, contractId, null));
    }

    // ── List (S7 / R6) ───────────────────────────────────────────────────────

    [Fact]
    public async Task ListForUserAsync_ReturnsOnlyOwnerContracts()
    {
        var (svc, db) = Build();
        var user1 = Guid.NewGuid();
        var user2 = Guid.NewGuid();
        await SeedContractAsync(db, user1);
        await SeedContractAsync(db, user1);
        await SeedContractAsync(db, user2); // belongs to another user

        var list = await svc.ListForUserAsync(user1);

        Assert.Equal(2, list.Count);
    }

    [Fact]
    public async Task ListForUserAsync_OtherUsersContractsNotVisible()
    {
        // R6 / R14: cross-user isolation
        var (svc, db) = Build();
        var user1 = Guid.NewGuid();
        var user2 = Guid.NewGuid();
        await SeedContractAsync(db, user1);

        var list = await svc.ListForUserAsync(user2);

        Assert.Empty(list);
    }

    // ── Get (S8) ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetForUserAsync_OwnedContract_ReturnsContractWithNullAnalysis()
    {
        var (svc, db) = Build();
        var (userId, contractId) = await SeedContractAsync(db);

        var result = await svc.GetForUserAsync(userId, contractId);

        Assert.Equal(contractId, result.Contract.Id);
        Assert.Null(result.Analysis); // not analysed yet
    }

    [Fact]
    public async Task GetForUserAsync_NonOwnedContract_ThrowsNotFoundException()
    {
        var (svc, db) = Build();
        var (_, contractId) = await SeedContractAsync(db);

        await Assert.ThrowsAsync<NotFoundException>(
            () => svc.GetForUserAsync(Guid.NewGuid(), contractId));
    }

    // ── Compare (S9) ─────────────────────────────────────────────────────────

    [Fact]
    public async Task CompareAsync_PersistsNewVersionWithParentId()
    {
        var mock = new MockLlmClient("""{"differences":["Payment changed."]}""");
        var (svc, db) = Build(llm: mock);
        var (userId, contractId) = await SeedContractAsync(db);

        var result = await svc.CompareAsync(userId, contractId, "v2.pdf", Stream.Null, null);

        Assert.NotEmpty(result.Differences);
        var newVersion = db.Contracts.Where(c => c.ParentContractId == contractId).FirstOrDefault();
        Assert.NotNull(newVersion);
        Assert.Equal(contractId, newVersion.ParentContractId);
    }

    [Fact]
    public async Task CompareAsync_NonOwnedContract_ThrowsNotFoundException()
    {
        var (svc, db) = Build();
        var (_, contractId) = await SeedContractAsync(db);

        await Assert.ThrowsAsync<NotFoundException>(
            () => svc.CompareAsync(Guid.NewGuid(), contractId, "v2.pdf", Stream.Null, null));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private sealed class AlwaysFailingLlmClient : ILlmClient
    {
        public Task<string> CompleteAsync(
            string prompt, string? system, double temperature,
            CancellationToken cancellationToken) =>
            throw new LlmUnavailableException("LLM unavailable in test.");
    }
}
