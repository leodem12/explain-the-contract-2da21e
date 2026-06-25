using WebApi.Auth;
using WebApi.Data;
using WebApi.Tests.Helpers;

namespace WebApi.Tests;

/// <summary>S1 — Register and log in, plus R13 (passwords not recoverable in plaintext).</summary>
public class AuthServiceTests
{
    private static AuthService Build() => new(DbHelper.CreateDb(), ConfigHelper.Build());

    // ── Registration ─────────────────────────────────────────────────────────

    [Fact]
    public async Task RegisterAsync_WithValidCredentials_ReturnsAuthResult()
    {
        var svc = Build();
        var result = await svc.RegisterAsync("alice@example.com", "Password1!", Role.Editor);

        Assert.NotNull(result.Token);
        Assert.NotEmpty(result.Token);
        Assert.Equal("alice@example.com", result.User.Email);
    }

    [Fact]
    public async Task RegisterAsync_TokenCarriesRoleClaim()
    {
        var svc = Build();
        var result = await svc.RegisterAsync("bob@example.com", "Password1!", Role.Viewer);

        // JWT is a three-part base64 string
        var parts = result.Token.Split('.');
        Assert.Equal(3, parts.Length);
    }

    [Fact]
    public async Task RegisterAsync_PasswordHashNeverInResult()
    {
        var svc = Build();
        var result = await svc.RegisterAsync("carol@example.com", "s3cr3t12", Role.Editor);

        // UserDto should not expose the hash
        Assert.Null(result.User.GetType().GetProperty("PasswordHash"));
    }

    [Fact]
    public async Task RegisterAsync_DuplicateEmail_ThrowsEmailAlreadyExistsException()
    {
        var svc = Build();
        await svc.RegisterAsync("dup@example.com", "Password1!", Role.Editor);

        await Assert.ThrowsAsync<EmailAlreadyExistsException>(
            () => svc.RegisterAsync("dup@example.com", "OtherPass1!", Role.Viewer));
    }

    [Theory]
    [InlineData("")]
    [InlineData("short")]   // 5 chars — below 8-char minimum
    [InlineData("1234567")] // exactly 7 chars
    public async Task RegisterAsync_WeakPassword_ThrowsWeakPasswordException(string password)
    {
        var svc = Build();
        await Assert.ThrowsAsync<WeakPasswordException>(
            () => svc.RegisterAsync("user@example.com", password, Role.Editor));
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    [Fact]
    public async Task LoginAsync_WithCorrectCredentials_ReturnsAuthResult()
    {
        var svc = Build();
        await svc.RegisterAsync("dave@example.com", "MyPass123", Role.Editor);
        var result = await svc.LoginAsync("dave@example.com", "MyPass123");

        Assert.NotNull(result.Token);
        Assert.Equal("dave@example.com", result.User.Email);
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_ThrowsInvalidCredentialsException()
    {
        var svc = Build();
        await svc.RegisterAsync("eve@example.com", "Correct123", Role.Viewer);

        await Assert.ThrowsAsync<InvalidCredentialsException>(
            () => svc.LoginAsync("eve@example.com", "WrongPass1"));
    }

    [Fact]
    public async Task LoginAsync_UnknownEmail_ThrowsInvalidCredentialsException()
    {
        var svc = Build();
        await Assert.ThrowsAsync<InvalidCredentialsException>(
            () => svc.LoginAsync("nobody@example.com", "AnyPass1!"));
    }

    [Fact]
    public async Task LoginAsync_UserDtoContainsNoPasswordField()
    {
        var svc = Build();
        await svc.RegisterAsync("frank@example.com", "SafePass9", Role.Editor);
        var result = await svc.LoginAsync("frank@example.com", "SafePass9");

        // Reflection: UserDto must not expose a password property (R13)
        var props = result.User.GetType().GetProperties()
            .Select(p => p.Name.ToLower());
        Assert.DoesNotContain("password", props);
        Assert.DoesNotContain("passwordhash", props);
        Assert.DoesNotContain("hash", props);
    }
}
