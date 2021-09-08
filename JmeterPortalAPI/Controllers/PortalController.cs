using JmeterPortalAPI.PersistenceHandler;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace JmeterPortalAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PortalController : ControllerBase
    {
        private readonly IConfiguration config;
        public PortalController(IConfiguration config)
        {
            this.config = config;
        }

        [HttpPost("add-testrun")]
        public async Task<ActionResult<string>> AddTestRun(TestRunDTO testRun){
            SQLProcedure procedure = new SQLProcedure(this.config);
            int res = await procedure.Insert(testRun);
            return Ok(res);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<List<CsvModel>>> GetWithID(string id){
            SQLProcedure procedure = new SQLProcedure(this.config);
            TestRun res = await procedure.GetDataOfId(id);
            List<CsvModel> data = new List<CsvModel>();
            if(res !=null){
                string decodedString = System.Text.ASCIIEncoding.ASCII.GetString(res.FileStreamData);
                string[] allRecords = decodedString.Split("\n");
                for(int i=0;i<allRecords.Length;i++){
                    string[] record = Regex.Split(allRecords[1], "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                    CsvModel cm = new CsvModel();
                    cm.timeStamp = Convert.ToInt64(record[0]);
                    cm.elapsed = Convert.ToInt32(record[1]);
                    cm.label = record[2];
                    cm.allThreads = Convert.ToInt32(record[12]);
                    data.Add(cm);
                }
                return data;

            }
            else{
                return NotFound();
            }
        }

        [HttpGet("all-results")]
        public async Task<ActionResult<List<AllTestRunsDTO>>> GetResults(){
            SQLProcedure procedure = new SQLProcedure(this.config);
            return await procedure.GetResults();
        }


    }
}
