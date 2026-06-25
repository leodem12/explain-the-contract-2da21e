using System.Text;
using LlmAdapter;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApi.Analysis;
using WebApi.Auth;
using WebApi.Contracts;
using WebApi.Data;
using WebApi.Export;
using WebApi.Notes;
using WebApi.Pdf;

var builder = WebApplication.CreateBuilder(args);

// --- Request size limit: cap uploads at 20 MB (DoS guard, matches the endpoint check) ---
builder.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = WebApi.Contracts.ContractEndpoints.MaxUploadBytes);

// --- Database ---
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default")));

// --- Auth services ---
builder.Services.AddScoped<AuthService>();

// --- LLM adapter (provider env-driven: LLM_PROVIDER=gemini|mock, default=mock) ---
builder.Services.AddSingleton<ILlmClient>(_ => LlmClientFactory.Create());
builder.Services.AddScoped<AnalysisService>();

// --- Contract services ---
builder.Services.AddScoped<PdfTextExtractor>();
builder.Services.AddScoped<ContractService>();

// --- Notes service ---
builder.Services.AddScoped<NotesService>();

// --- Export service ---
builder.Services.AddScoped<ExportService>();

// --- JWT bearer ---
// The signing key is a secret: it MUST be supplied out-of-band (environment
// variable Jwt__Key, e.g. DOTNET_Jwt__Key). Fail fast rather than run with a
// missing or committed key.
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
    throw new InvalidOperationException(
        "Jwt:Key is not configured. Supply it via the Jwt__Key environment variable.");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        };
    });

builder.Services.AddAuthorization();

// --- CORS: allow Angular dev server ---
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:4200")
     .AllowAnyHeader()
     .AllowAnyMethod()));

var app = builder.Build();

// --- Schema creation at startup ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// --- Serve Angular SPA from wwwroot ---
app.UseDefaultFiles();
app.UseStaticFiles();

// --- Auth endpoints (public) ---
app.MapAuthEndpoints();

// --- Contract endpoints (upload, list, get) ---
app.MapContractEndpoints();

// --- Notes endpoints ---
app.MapNotesEndpoints();

// Fall back to index.html for Angular client-side routing
app.MapFallbackToFile("index.html");

app.Run();
