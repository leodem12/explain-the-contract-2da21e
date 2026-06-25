FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY nuget.config ./
COPY ExplainTheContract.slnx ./
COPY api/ ./api/
COPY LlmAdapter/ ./LlmAdapter/
COPY tests/ ./tests/
RUN dotnet restore ExplainTheContract.slnx
RUN dotnet publish api/WebApi.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY web/dist/web/browser ./wwwroot/
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "WebApi.dll"]
