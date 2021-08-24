using System;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Model;

namespace JmeterPortalAPI.PersistenceHandler
{
    public class SQLProcedure
    {
        private IConfiguration config;
        public SQLProcedure(IConfiguration _config)
        {
            this.config = _config;
        }

        public async Task<int> Insert(TestRunDTO testRun){
            SqlConnection connection = new SqlConnection(config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();
            SqlCommand cmd = new SqlCommand(@"dbo.[InsertData]", connection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TestName", SqlDbType.NVarChar).Value = testRun.TestName;
            cmd.Parameters.AddWithValue("@TestRunID", SqlDbType.NVarChar).Value = testRun.TestRunID;
            cmd.Parameters.AddWithValue("@Environment", SqlDbType.NVarChar).Value = testRun.Environment;
            cmd.Parameters.AddWithValue("@FileName", SqlDbType.NVarChar).Value = testRun.FileName;
            cmd.Parameters.AddWithValue("@FileUploadDate", SqlDbType.NVarChar).Value = testRun.FileUploadDate;
            if(testRun.FileStreamDataBase64.Contains(",")){
                testRun.FileStreamDataBase64 = testRun.FileStreamDataBase64.Substring(testRun.FileStreamDataBase64.IndexOf(",")+1);
            }
            cmd.Parameters.AddWithValue("@Bytes", SqlDbType.NVarChar).Value = Convert.FromBase64String(testRun.FileStreamDataBase64);
            int res = cmd.ExecuteNonQuery();
            connection.Close();
            return res;
        }
    }
}