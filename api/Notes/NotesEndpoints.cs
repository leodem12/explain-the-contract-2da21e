using System.Security.Claims;
using WebApi.Auth;
using WebApi.Contracts;
using WebApi.Data;

namespace WebApi.Notes;

public static class NotesEndpoints
{
    public static IEndpointRouteBuilder MapNotesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/contracts/{id:guid}/notes").RequireAuthorization();

        group.MapGet("/", ListNotes);
        group.MapPost("/", AddNote);

        return app;
    }

    // GET /api/contracts/{id}/notes — returns 200 Note[] or 404
    private static async Task<IResult> ListNotes(
        Guid id, ClaimsPrincipal user, NotesService svc)
    {
        try
        {
            var notes = await svc.ListNotesAsync(ParseUserId(user), id);
            return Results.Ok(notes);
        }
        catch (NotFoundException)
        {
            return Results.NotFound();
        }
    }

    // POST /api/contracts/{id}/notes — Editor only; returns 201 Note or 403/404
    private static async Task<IResult> AddNote(
        Guid id, ClaimsPrincipal user, NotesService svc, AddNoteRequest body)
    {
        var roleStr = user.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
        var role = Enum.TryParse<Role>(roleStr, ignoreCase: true, out var r) ? r : Role.Viewer;

        try
        {
            var note = await svc.AddNoteAsync(ParseUserId(user), role, id, body.Text);
            return Results.Created($"/api/contracts/{id}/notes/{note.Id}", note);
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
        catch (ForbiddenException)
        {
            return Results.Forbid();
        }
        catch (NotFoundException)
        {
            return Results.NotFound();
        }
    }

    private static Guid ParseUserId(ClaimsPrincipal user)
    {
        var idStr = user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("User ID claim missing.");
        return Guid.Parse(idStr);
    }
}

public record AddNoteRequest(string Text);
