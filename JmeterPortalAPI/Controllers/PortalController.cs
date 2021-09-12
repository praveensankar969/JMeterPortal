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
        [HttpGet("actual-thread-vs-response-chart/{id}")]
        public async Task<ActionResult<ActualThreadVResponse>> ActualThreadVsResponse(string id){
            SQLProcedure procedure = new SQLProcedure(this.config);
            TestRun res = await procedure.GetDataOfId(id);
            List<CsvModel> data = new List<CsvModel>();
            Dictionary<string, List<CsvModel>> dictionary = new Dictionary<string, List<CsvModel>>();
            if(res !=null){
                string decodedString = System.Text.ASCIIEncoding.ASCII.GetString(res.FileStreamData);
                string[] allRecords = decodedString.Split("\n");
                for(int i=1;i<allRecords.Length-1;i++){
                    string[] record = Regex.Split(allRecords[i], "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                    CsvModel cm = new CsvModel();
                    cm.timeStamp = Convert.ToInt64(record[0]);
                    cm.elapsed = Convert.ToInt32(record[1]);
                    cm.label = record[2];
                    cm.allThreads = Convert.ToInt32(record[12]);
                    data.Add(cm);

                    if(dictionary.ContainsKey(cm.label)){
                        List<CsvModel> copyModel = new List<CsvModel>();
                        dictionary.TryGetValue(cm.label, out copyModel);
                        copyModel.Add(cm);
                        copyModel.Sort((x,y)=> x.timeStamp.CompareTo(y.timeStamp));
                        dictionary.Remove(cm.label);
                        dictionary.Add(cm.label, copyModel);
                    }
                    else{
                        dictionary.Add(cm.label, new List<CsvModel>() {cm});
                    }
                }
                ChartDataCreator chartData = new ChartDataCreator();
                return chartData.ComputeActualThreadVsResponse(dictionary);
                

            }
            else{
                return NotFound();
            }
        }

        [HttpGet("percentile-chart/{id}")]
        public async Task<ActionResult<PercentileChart>> Percentile(string id){
            SQLProcedure procedure = new SQLProcedure(this.config);
            TestRun res = await procedure.GetDataOfId(id);
            List<CsvModel> data = new List<CsvModel>();
            Dictionary<string, List<CsvModel>> dictionary = new Dictionary<string, List<CsvModel>>();
            if(res !=null){
                string decodedString = System.Text.ASCIIEncoding.ASCII.GetString(res.FileStreamData);
                string[] allRecords = decodedString.Split("\n");
                for(int i=1;i<allRecords.Length-1;i++){
                    string[] record = Regex.Split(allRecords[i], "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                    CsvModel cm = new CsvModel();
                    cm.timeStamp = Convert.ToInt64(record[0]);
                    cm.elapsed = Convert.ToInt32(record[1]);
                    cm.label = record[2];
                    cm.allThreads = Convert.ToInt32(record[12]);
                    data.Add(cm);

                    if(dictionary.ContainsKey(cm.label)){
                        List<CsvModel> copyModel = new List<CsvModel>();
                        dictionary.TryGetValue(cm.label, out copyModel);
                        copyModel.Add(cm);
                        copyModel.Sort((x,y)=> x.timeStamp.CompareTo(y.timeStamp));
                        dictionary.Remove(cm.label);
                        dictionary.Add(cm.label, copyModel);
                    }
                    else{
                        dictionary.Add(cm.label, new List<CsvModel>() {cm});
                    }
                }
                ChartDataCreator chartData = new ChartDataCreator();
                return chartData.ComputePercentile(dictionary);
                

            }
            else{
                return NotFound();
            }
        }

        [HttpGet("average-response-over-time-chart/{id}")]
        public async Task<ActionResult<ResponseTimeVTime>> AverageResponseVsTime(string id){
            SQLProcedure procedure = new SQLProcedure(this.config);
            TestRun res = await procedure.GetDataOfId(id);
            List<CsvModel> data = new List<CsvModel>();
            Dictionary<string, List<CsvModel>> dictionary = new Dictionary<string, List<CsvModel>>();
            if(res !=null){
                string decodedString = System.Text.ASCIIEncoding.ASCII.GetString(res.FileStreamData);
                string[] allRecords = decodedString.Split("\n");
                for(int i=1;i<allRecords.Length-1;i++){
                    string[] record = Regex.Split(allRecords[i], "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                    CsvModel cm = new CsvModel();
                    cm.timeStamp = Convert.ToInt64(record[0]);
                    cm.elapsed = Convert.ToInt32(record[1]);
                    cm.label = record[2];
                    cm.allThreads = Convert.ToInt32(record[12]);
                    data.Add(cm);

                    if(dictionary.ContainsKey(cm.label)){
                        List<CsvModel> copyModel = new List<CsvModel>();
                        dictionary.TryGetValue(cm.label, out copyModel);
                        copyModel.Add(cm);
                        copyModel.Sort((x,y)=> x.timeStamp.CompareTo(y.timeStamp));
                        dictionary.Remove(cm.label);
                        dictionary.Add(cm.label, copyModel);
                    }
                    else{
                        dictionary.Add(cm.label, new List<CsvModel>() {cm});
                    }
                }
                ChartDataCreator chartData = new ChartDataCreator();
                return chartData.ComputeAverageResponseTimeVsTime(dictionary);
            }
            else{
                return NotFound();
            }
        }

        [HttpGet("get-map/{id}")]
        public async Task<ActionResult<Dictionary<string, List<CsvModel>>>> GetMap(string id){
            SQLProcedure procedure = new SQLProcedure(this.config);
            TestRun res = await procedure.GetDataOfId(id);
            List<CsvModel> data = new List<CsvModel>();
            Dictionary<string, List<CsvModel>> dictionary = new Dictionary<string, List<CsvModel>>();
            if(res !=null){
                string decodedString = System.Text.ASCIIEncoding.ASCII.GetString(res.FileStreamData);
                string[] allRecords = decodedString.Split("\n");
                for(int i=1;i<allRecords.Length-1;i++){
                    string[] record = Regex.Split(allRecords[i], "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                    CsvModel cm = new CsvModel();
                    cm.timeStamp = Convert.ToInt64(record[0]);
                    cm.elapsed = Convert.ToInt32(record[1]);
                    cm.label = record[2];
                    cm.allThreads = Convert.ToInt32(record[12]);
                    data.Add(cm);

                    if(dictionary.ContainsKey(cm.label)){
                        List<CsvModel> copyModel = new List<CsvModel>();
                        dictionary.TryGetValue(cm.label, out copyModel);
                        copyModel.Add(cm);
                        copyModel.Sort((x,y)=> x.timeStamp.CompareTo(y.timeStamp));
                        dictionary.Remove(cm.label);
                        dictionary.Add(cm.label, copyModel);
                    }
                    else{
                        dictionary.Add(cm.label, new List<CsvModel>() {cm});
                    }
                }
                return dictionary;
                

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

        [HttpGet("old/{id}")]
        public async Task<ActionResult<TestRun>> GetWithID(string id){
            SQLProcedure procedure = new SQLProcedure(this.config);
            TestRun res = await procedure.GetDataOfId(id);
            if(res !=null){
                return res;
            }
            else{
                return NotFound();
            }
        }
        


    }
}
