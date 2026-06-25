using System.Security.Claims;
using WebApi.Auth;
using WebApi.Data;

namespace WebApi.Tests;

/// <summary>S2 — Viewer vs Editor permissions gate (RoleAuthorization.RequireEditor).</summary>
public class RoleAuthorizationTests
{
    private static ClaimsPrincipal MakePrincipal(string? role) =>
        new(new ClaimsIdentity(
            role is null
                ? []
                : [new Claim(ClaimTypes.Role, role)],
            "test"));

    [Fact]
    public void RequireEditor_WithEditorRole_DoesNotThrow()
    {
        var principal = MakePrincipal(Role.Editor.ToString());
        // Should not throw
        RoleAuthorization.RequireEditor(principal);
    }

    [Fact]
    public void RequireEditor_WithViewerRole_ThrowsForbiddenException()
    {
        var principal = MakePrincipal(Role.Viewer.ToString());
        Assert.Throws<ForbiddenException>(() => RoleAuthorization.RequireEditor(principal));
    }

    [Fact]
    public void RequireEditor_WithNoRoleClaim_ThrowsForbiddenException()
    {
        var principal = MakePrincipal(null);
        Assert.Throws<ForbiddenException>(() => RoleAuthorization.RequireEditor(principal));
    }

    [Fact]
    public void RequireEditor_WithUnrecognisedRole_ThrowsForbiddenException()
    {
        var principal = MakePrincipal("SuperAdmin");
        Assert.Throws<ForbiddenException>(() => RoleAuthorization.RequireEditor(principal));
    }
}
