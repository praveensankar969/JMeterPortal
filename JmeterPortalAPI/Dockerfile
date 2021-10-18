FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["JmeterPortalAPI/JmeterPortalAPI.csproj", "JmeterPortalAPI/"]
RUN dotnet restore "JmeterPortalAPI/JmeterPortalAPI.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "JmeterPortalAPI/JmeterPortalAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "JmeterPortalAPI/JmeterPortalAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "JmeterPortalAPI.dll"]
