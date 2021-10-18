using JmeterPortalAPI.PersistenceHandler;
using JmeterPortalAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Model;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace JmeterPortalAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PortalController : ControllerBase
    {
        private readonly DataContext _context;
        public PortalController(DataContext _context)
        {
            this._context = _context;
        }

        [HttpPost("add-testrun")]
        public async Task<ActionResult<string>> AddTestRun(TestRunDTO testRun)
        {
            if(testRun.FileStreamDataBase64.Contains(",")){
                testRun.FileStreamDataBase64 = testRun.FileStreamDataBase64.Substring(testRun.FileStreamDataBase64.IndexOf(",")+1);
            }
            var obj = new TestRun {
                TestName = testRun.TestName,
                TestRunID = testRun.TestRunID,
                Environment = testRun.Environment,
                FileName = testRun.FileName,
                FileUploadDate = testRun.FileUploadDate,
                FileStreamData = Convert.FromBase64String(testRun.FileStreamDataBase64)
            };
            await this._context.TestRuns.AddAsync(obj);
            await this._context.SaveChangesAsync();
            return Ok();

        }

        [HttpGet("actual-thread-vs-response-chart/{id}")]
        public async Task<ActionResult<ActualThreadVResponse>> ActualThreadVsResponse(string id, int responseTime = 0, string op = "greater")
        {
            DictionaryCreator service = new DictionaryCreator(this._context);
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
            DictionaryCreator service = new DictionaryCreator(this._context);
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
            DictionaryCreator service = new DictionaryCreator(this._context);
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
                if (timeFrom.CompareTo(timeTo) > 0)
                {
                    return BadRequest();
                }
            }

            DictionaryCreator service = new DictionaryCreator(this._context);
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
            Regex regex = new Regex("^\\d{2}, \\d{2}:\\d{2}$", RegexOptions.IgnoreCase);
            if (!string.IsNullOrEmpty(timeTo) && !string.IsNullOrEmpty(timeFrom))
            {
                if (!regex.IsMatch(timeFrom) || !regex.IsMatch(timeTo))
                    return BadRequest();
                if (timeFrom.CompareTo(timeTo) > 0)
                {
                    return BadRequest();
                }
            }

            DictionaryCreator service = new DictionaryCreator(this._context);
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
            var results = new List<AllTestRunsDTO>();
            var data = await this._context.TestRuns.ToListAsync();
            foreach (var item in data)
            {
                results.Add(new AllTestRunsDTO{
                    Id = item.Id,
                    TestName = item.TestName,
                    TestRunID = item.TestRunID,
                    Environment = item.Environment,
                    FileName = item.FileName,
                    FileUploadDate = item.FileUploadDate
                });
            }
            return results;
        }

        [HttpGet("testrun/{id}")]
        public async Task<ActionResult<TestRun>> GetWithID(string id)
        {
            Guid guid;
            if (Guid.TryParse(id, out guid)){
                var res = await this._context.TestRuns.FirstOrDefaultAsync(x => x.Id == guid);
                if(res != null){
                    return res;
                }
                else{
                    return NotFound();
                }
            }
            else{
                return NotFound();
            }
            
        }




    }
}
