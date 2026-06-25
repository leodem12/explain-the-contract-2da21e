using Microsoft.Extensions.Configuration;

namespace WebApi.Tests.Helpers;

internal static class ConfigHelper
{
    /// <summary>Minimal IConfiguration for AuthService (JWT settings).</summary>
    public static IConfiguration Build() =>
        new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"]              = "test-secret-key-that-is-at-least-32-chars-long!",
                ["Jwt:Issuer"]           = "test-issuer",
                ["Jwt:Audience"]         = "test-audience",
                ["Jwt:ExpiresInMinutes"] = "60",
            })
            .Build();
}
