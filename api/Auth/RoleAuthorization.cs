using System.Security.Claims;
using WebApi.Data;

namespace WebApi.Auth;

/// <summary>Thrown when a Viewer attempts a create/modify action.</summary>
public sealed class ForbiddenException(string message = "This action requires the Editor role.")
    : Exception(message);

/// <summary>Reusable role checks consumed by all create/modify endpoints.</summary>
public static class RoleAuthorization
{
    /// <summary>
    /// Parses the role claim from <paramref name="user"/> and throws
    /// <see cref="ForbiddenException"/> when the principal is not an Editor.
    /// </summary>
    public static void RequireEditor(ClaimsPrincipal user)
    {
        var roleStr = user.FindFirstValue(ClaimTypes.Role);
        if (!Enum.TryParse<Role>(roleStr, ignoreCase: true, out var role) || role != Role.Editor)
            throw new ForbiddenException();
    }
}
