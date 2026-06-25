using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApi.Data;

namespace WebApi.Auth;

public class AuthService(AppDbContext db, IConfiguration config)
{
    public async Task<AuthResult> RegisterAsync(string email, string password, Role role)
    {
        if (string.IsNullOrEmpty(password) || password.Length < 8)
            throw new WeakPasswordException();

        if (await db.Users.AnyAsync(u => u.Email == email))
            throw new EmailAlreadyExistsException();

        var user = new User
        {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = role,
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        return new AuthResult(IssueToken(user), ToDto(user));
    }

    public async Task<AuthResult> LoginAsync(string email, string password)
    {
        var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email)
            ?? throw new InvalidCredentialsException();

        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            throw new InvalidCredentialsException();

        return new AuthResult(IssueToken(user), ToDto(user));
    }

    private string IssueToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiry = int.Parse(config["Jwt:ExpiresInMinutes"] ?? "1440");

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiry),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UserDto ToDto(User u) => new(u.Id, u.Email, u.Role.ToString());
}
