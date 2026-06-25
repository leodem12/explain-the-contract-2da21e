using WebApi.Data;

namespace WebApi.Auth;

public record UserDto(Guid Id, string Email, string Role);

public record AuthResult(string Token, UserDto User);
