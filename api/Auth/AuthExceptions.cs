namespace WebApi.Auth;

public sealed class EmailAlreadyExistsException()
    : Exception("Email already registered.");

public sealed class InvalidCredentialsException()
    : Exception("Invalid email or password.");

public sealed class WeakPasswordException()
    : Exception("Password must be at least 8 characters.");
