using JmeterPortalAPI.PersistenceHandler;
using JmeterPortalAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Model;
using System.Collections.Generic;
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
        public async Task<ActionResult<string>> AddTestRun(TestRunDTO testRun)
        {
            SQLProcedure procedure = new SQLProcedure(this.config);
            int res = await procedure.Insert(testRun);
            return Ok(res);
        }

        [HttpGet("actual-thread-vs-response-chart/{id}")]
        public async Task<ActionResult<ActualThreadVResponse>> ActualThreadVsResponse(string id, int responseTime = 0, string op = "greater")
        {
            DictionaryCreator service = new DictionaryCreator(this.config);
            Dictionary<string, List<CsvModel>> dictionary = await service.GetMap(id);
            if (dictionary != null)
            {
                ChartDataCreator chartData = new ChartDataCreator();
                return chartData.ComputeThreadVResponseChart(dictionary, responseTime, op, ChartTypes.ActualThreadVsResponse);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("average-response-over-thread-chart/{id}")]
        public async Task<ActionResult<ActualThreadVResponse>> AverageResponseVsThread(string id, int responseTime = 0, string op = "greater")
        {
            DictionaryCreator service = new DictionaryCreator(this.config);
            Dictionary<string, List<CsvModel>> dictionary = await service.GetMap(id);
            if (dictionary != null)
            {
                ChartDataCreator chartData = new ChartDataCreator();
                return chartData.ComputeThreadVResponseChart(dictionary, responseTime, op, ChartTypes.AverageThreadVResponse);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("percentile-chart/{id}")]
        public async Task<ActionResult<PercentileChart>> Percentile(string id, int responseTime = 0, string op = "greater")
        {
            DictionaryCreator service = new DictionaryCreator(this.config);
            Dictionary<string, List<CsvModel>> dictionary = await service.GetMap(id);
            if (dictionary != null)
            {
                ChartDataCreator chartData = new ChartDataCreator();
                return chartData.ComputePercentile(dictionary, responseTime, op);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("average-response-over-time-chart/{id}")]
        public async Task<ActionResult<ResponseTimeVTime>> AverageResponseVsTime(string id, string timeFrom, string timeTo, int responseTime = 0, string op = "greater")
        {
            Regex regex = new Regex("^\\d{2}, \\d{2}:\\d{2}$", RegexOptions.IgnoreCase);
            if (!string.IsNullOrEmpty(timeTo) && !string.IsNullOrEmpty(timeFrom))
            {
                if (!regex.IsMatch(timeFrom) || !regex.IsMatch(timeTo))
                    return BadRequest();
                if(timeFrom.CompareTo(timeTo)>0){
                    return BadRequest();
                }
            }

            DictionaryCreator service = new DictionaryCreator(this.config);
            Dictionary<string, List<CsvModel>> dictionary = await service.GetMap(id);
            if (dictionary != null)
            {
                ChartDataCreator chartData = new ChartDataCreator();
                return chartData.ComputeResponseVTimeChart(dictionary, timeFrom, timeTo, responseTime, op, ChartTypes.AverageResponseVTime);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("actual-response-over-time-chart/{id}")]
        public async Task<ActionResult<ResponseTimeVTime>> ActualResponseVsTime(string id, string timeFrom, string timeTo, int responseTime = 0, string op = "greater")
        {
            Regex regex = new Regex("^\\d{2}, \\d{2}:\\d{2}:\\d{2}$", RegexOptions.IgnoreCase);
            if (!string.IsNullOrEmpty(timeTo) && !string.IsNullOrEmpty(timeFrom))
            {
                if (!regex.IsMatch(timeFrom) || !regex.IsMatch(timeTo))
                    return BadRequest();
                if(timeFrom.CompareTo(timeTo)>0){
                    return BadRequest();
                }
            }

            DictionaryCreator service = new DictionaryCreator(this.config);
            Dictionary<string, List<CsvModel>> dictionary = await service.GetMap(id);
            if (dictionary != null)
            {
                ChartDataCreator chartData = new ChartDataCreator();
                return chartData.ComputeResponseVTimeChart(dictionary, timeFrom, timeTo, responseTime, op, ChartTypes.ActualResponseVsTime);
            }
            else
            {
                return NotFound();
            }
        }


        [HttpGet("all-results")]
        public async Task<ActionResult<List<AllTestRunsDTO>>> GetResults()
        {
            SQLProcedure procedure = new SQLProcedure(this.config);
            return await procedure.GetResults();
        }

        [HttpGet("testrun/{id}")]
        public async Task<ActionResult<TestRun>> GetWithID(string id)
        {
            SQLProcedure procedure = new SQLProcedure(this.config);
            TestRun res = await procedure.GetDataOfId(id);
            if (res != null)
            {
                return res;
            }
            else
            {
                return NotFound();
            }
        }




    }
}
