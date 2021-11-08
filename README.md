# JMeter Portal

Jmeter Portal is a Visualization project aimed at producing a much cleaner and user-friendly Jmeter HTML result Dashboard.

## Description

The Jmeter Portal project can visualize 5 different types of chart.
* Actual Response Time Over Time
* Average Response Time Over Time
* Actual Thread Count over Response Time
* Average Thread Count over Response Time
* Percentile Chart

The generated charts can be filtered on Elapsed Time and Response Time.

The Jmeter Portal can be used to generate Aggregrate Report from CSV input
* Filter desired samples 
* Filter desired time range

## Getting Started

### Dependencies
* [Jmeter](https://jmeter.apache.org/)
* [SQL Server](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15)
* [Node.js](https://nodejs.org/en/)
* [npm packages](https://docs.npmjs.com/about-npm)
* [.Net Framework](https://dotnet.microsoft.com/download)

### Executing
* Setup database project in SQL Server Management Studio
* Update connection strings in Dotnet Web API and start API 
```bash
dotnet run
```
* Start Angular application
```bash
ng serve
```

## Contributing
Contributions are always welcome! Please create a PR to add Github Profile.

Give a ⭐️ if this project helped you!
