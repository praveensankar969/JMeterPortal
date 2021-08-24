﻿CREATE TABLE [dbo].[TestRuns] (
    [Id]             UNIQUEIDENTIFIER DEFAULT (newid()) ROWGUIDCOL NOT NULL,
    [TestName]       VARCHAR (150)    NULL,
    [TestRunID]      VARCHAR (150)    NULL,
    [Environment]    VARCHAR (25)     NULL,
    [FileName]       VARCHAR (MAX)    NULL,
    [FileUploadDate] DATETIME         NULL,
    [FileStreamData] VARBINARY (MAX)  NULL,
    UNIQUE NONCLUSTERED ([Id] ASC)
);

