-- ================================================
CREATE PROCEDURE GetWithId @Id uniqueidentifier
AS
BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM TestRuns
	WHERE Id = @Id
END