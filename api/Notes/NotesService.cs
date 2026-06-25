using Microsoft.EntityFrameworkCore;
using WebApi.Auth;
using WebApi.Contracts;
using WebApi.Data;

namespace WebApi.Notes;

public class NotesService(AppDbContext db)
{
    private const int MaxNoteLength = 5_000;

    /// <summary>
    /// Returns all notes for a contract owned by the caller.
    /// Throws <see cref="NotFoundException"/> when the contract is not owned by <paramref name="userId"/>.
    /// </summary>
    public async Task<IReadOnlyList<NoteDto>> ListNotesAsync(Guid userId, Guid contractId)
    {
        await AssertOwnerAsync(userId, contractId);

        return await db.Notes
            .Where(n => n.ContractId == contractId)
            .OrderBy(n => n.CreatedAt)
            .Join(db.Users,
                  n => n.AuthorUserId,
                  u => u.Id,
                  (n, u) => new NoteDto(n.Id, n.Text, u.Email, n.CreatedAt))
            .ToListAsync();
    }

    /// <summary>
    /// Adds a note to an owned contract. Editor-only; Viewers get <see cref="ForbiddenException"/>.
    /// Throws <see cref="NotFoundException"/> when the contract is not owned by the caller.
    /// </summary>
    public async Task<NoteDto> AddNoteAsync(Guid userId, Role role, Guid contractId, string text)
    {
        if (role != Role.Editor)
            throw new ForbiddenException();

        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Note text cannot be empty.");
        if (text.Length > MaxNoteLength)
            throw new ArgumentException($"Note text cannot exceed {MaxNoteLength} characters.");

        await AssertOwnerAsync(userId, contractId);

        var note = new Note
        {
            ContractId = contractId,
            AuthorUserId = userId,
            Text = text,
        };
        db.Notes.Add(note);
        await db.SaveChangesAsync();

        var authorEmail = await db.Users
            .Where(u => u.Id == userId)
            .Select(u => u.Email)
            .FirstAsync();

        return new NoteDto(note.Id, note.Text, authorEmail, note.CreatedAt);
    }

    private async Task AssertOwnerAsync(Guid userId, Guid contractId)
    {
        var owned = await db.Contracts
            .AnyAsync(c => c.Id == contractId && c.OwnerUserId == userId);
        if (!owned)
            throw new NotFoundException("Contract not found.");
    }
}

/// <summary>Wire DTO — matches the frozen API contract: {id, text, authorEmail, createdAt}.</summary>
public record NoteDto(Guid Id, string Text, string AuthorEmail, DateTime CreatedAt);
