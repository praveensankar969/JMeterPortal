FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["JmeterPortalAPI/JmeterPortalAPI.csproj", "JmeterPortalAPI/"]
RUN dotnet restore "JmeterPortalAPI\JmeterPortalAPI.csproj"
COPY . .
WORKDIR "/src/JmeterPortalAPI"
RUN dotnet build "JmeterPortalAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "JmeterPortalAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "JmeterPortalAPI.dll"]
