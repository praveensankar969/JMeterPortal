
CREATE PROCEDURE [dbo].[InsertData] @TestName VARCHAR(150)
	,@TestRunID VARCHAR(150)
	,@Environment VARCHAR(25)
	,@FileName VARCHAR(max)
	,@FileUploadDate DATETIME
	,@Bytes varbinary(max)
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO TestRuns (
		TestName
		,TestRunID
		,Environment
		,[FileName]
		,FileUploadDate
		,FileStreamData
		)
	Values( @TestName, @TestRunID, @Environment, @FileName, @FileUploadDate, @Bytes)
END