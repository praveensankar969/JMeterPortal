using System;
using System.Collections.Generic;
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

        public async Task<TestRun> GetDataOfId(string id)
        {
            SqlConnection connection = new SqlConnection(config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();
            SqlCommand cmd = new SqlCommand(@"dbo.[GetWithId]", connection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Id", SqlDbType.NVarChar).Value = id;
            SqlDataReader reader = cmd.ExecuteReader();
            if(reader.Read()){
                return new TestRun{
                    Id = reader.GetSqlGuid(0).ToString(),
                    TestName = reader.GetString(1),
                    TestRunID = reader.GetString(2),
                    Environment = reader.GetString(3),
                    FileName = reader.GetString(4),
                    FileUploadDate = reader.GetDateTime(5),
                    FileStreamData = (byte[])reader["FileStreamData"]
                };
            }
            else{
                return null;
            }
        }

        public async Task<List<AllTestRunsDTO>> GetResults()
        {
            DataTable table = new DataTable();
            List<AllTestRunsDTO> result = new List<AllTestRunsDTO>();
            SqlConnection connection = new SqlConnection(config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();
            SqlCommand cmd = new SqlCommand(@"dbo.[GetData]", connection);
            cmd.CommandType = CommandType.StoredProcedure;
            var adapter = new SqlDataAdapter(cmd);
            adapter.Fill(table);
            foreach(DataRow row in table.Rows){
                result.Add(new AllTestRunsDTO{
                    Id = row["Id"].ToString(),
                    TestName = row["TestName"].ToString(),
                    TestRunID = row["TestRunID"].ToString(),
                    Environment = row["Environment"].ToString(),
                    FileName = row["FileName"].ToString(),
                    FileUploadDate = DateTime.Parse(row["FileUploadDate"].ToString())
                });
            }

            return result;
        }

    }
}