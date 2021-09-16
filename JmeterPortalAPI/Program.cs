using System;
using System.Globalization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace JmeterPortalAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // var time = 1628792827114;
            // DateTime dt = new DateTime(1970,1,1,5,0,0).Add(TimeSpan.FromMilliseconds(time));
            // //dtDateTime = dtDateTime.AddMilliseconds(time).ToLocalTime();
            // //dt = dt.Add(TimeSpan.FromMilliseconds(time)).ToUniversalTime();
            // Console.WriteLine(dt);
            // Console.WriteLine(dt.ToString("dd-MM-yyyy, hh:mm:ss tt", CultureInfo.InvariantCulture));
           
           CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
