using WebApi.Data;

namespace WebApi.Auth;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth");

        group.MapPost("/register", async (RegisterRequest req, AuthService svc) =>
        {
            if (!Enum.TryParse<Role>(req.Role, ignoreCase: true, out var role))
                return Results.BadRequest("Role must be Viewer or Editor.");

            try
            {
                var result = await svc.RegisterAsync(req.Email, req.Password, role);
                return Results.Created("/api/auth/register", result);
            }
            catch (WeakPasswordException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
            catch (EmailAlreadyExistsException)
            {
                return Results.Conflict(new { error = "Email already registered." });
            }
        });

        group.MapPost("/login", async (LoginRequest req, AuthService svc) =>
        {
            try
            {
                var result = await svc.LoginAsync(req.Email, req.Password);
                return Results.Ok(result);
            }
            catch (InvalidCredentialsException)
            {
                return Results.Unauthorized();
            }
        });

        return app;
    }

    private record RegisterRequest(string Email, string Password, string Role);
    private record LoginRequest(string Email, string Password);
}
