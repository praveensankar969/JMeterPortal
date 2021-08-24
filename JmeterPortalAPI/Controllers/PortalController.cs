using JmeterPortalAPI.PersistenceHandler;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
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


    }
}
