using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Model;

namespace JmeterPortalAPI{
    public class ChartDataCreator{
        public ActualThreadVResponse ComputeActualThreadVsResponse(Dictionary<string, List<CsvModel>> dictionary){
            string[] labels = new string[dictionary.Count];
            List<int> xAxisLabel = new List<int>();
            List<ChartDataSet> datasets = new List<ChartDataSet>();
            int index=0;
            string color="";
            var random = new Random();
            
            foreach (var item in dictionary)
            {
                labels[index] = item.Key;
                color = String.Format("#{0:X6}", random.Next(0x1000000));
                List<CsvModel> sortedAllThread = item.Value;
                sortedAllThread.Sort((x ,y)=> x.allThreads - y.allThreads);
                ChartDataSet dataset = new ChartDataSet();
                dataset.label = item.Key;
                dataset.borderColor = color;
                dataset.pointBorderColor = color;
                dataset.showLine = false;
                dataset.data = new int[sortedAllThread.Count][];
                
                for(int i=0;i<sortedAllThread.Count;i++){
                    dataset.data[i] = new int[] {sortedAllThread.ElementAt(i).allThreads, sortedAllThread.ElementAt(i).elapsed};
                    xAxisLabel.Add(sortedAllThread.ElementAt(i).allThreads);
                }
                datasets.Add(dataset);
                index++;
            }
            xAxisLabel = xAxisLabel.Distinct().ToList();

            return new ActualThreadVResponse {
                labels = labels,
                xAxisLabel = xAxisLabel.ToArray(),
                datasets = datasets.ToArray()
            };

        }

        public PercentileChart ComputePercentile(Dictionary<string, List<CsvModel>> dictionary){
            string[] labels = new string[dictionary.Count];
            List<int> xAxisLabel = new List<int>();
            List<PercentileChartDataSet> datasets = new List<PercentileChartDataSet>();
            int index=0;
            string color="";
            var random = new Random();
            
            foreach (var item in dictionary)
            {
                labels[index] = item.Key;
                color = String.Format("#{0:X6}", random.Next(0x1000000));
                List<CsvModel> sortedPercentile = item.Value;
                sortedPercentile.Sort((x ,y)=> x.elapsed - y.elapsed);
                PercentileChartDataSet dataset = new PercentileChartDataSet();
                dataset.label = item.Key;
                dataset.borderColor = color;
                dataset.pointBorderColor = color;
                dataset.showLine = true;
                dataset.data = new double[sortedPercentile.Count][];
                for(int i=0;i<sortedPercentile.Count;i++){
                    dataset.data[i] = new double[] {Math.Round((((double)i/sortedPercentile.Count)*100),1), sortedPercentile.ElementAt(i).elapsed};
                    
                }
                datasets.Add(dataset);
                index++;
            }

            return new PercentileChart {
                labels = labels,
                xAxisLabel = xAxisLabel.ToArray(),
                datasets = datasets.ToArray()
            };

        }

        public ResponseTimeVTime ComputeAverageResponseTimeVsTime(Dictionary<string, List<CsvModel>> dictionary){
            System.DateTime dtDateTime = new DateTime(1970,1,1,0,0,0,0,System.DateTimeKind.Utc);
            string[] labels = new string[dictionary.Count];
            List<long> xAxisLabel = new List<long>();
            List<ResponseTimeChartDataSet> datasets = new List<ResponseTimeChartDataSet>();
            int index=0;
            string color="";
            var random = new Random();
            
            foreach (var item in dictionary)
            {
                labels[index] = item.Key;
                color = String.Format("#{0:X6}", random.Next(0x1000000));
                List<CsvModel> sortedTimeStamp = item.Value;
                sortedTimeStamp.Sort((x ,y)=> x.timeStamp.CompareTo(y.timeStamp));
                var data = sortedTimeStamp.Select(x=> {return new long[] {x.timeStamp, x.elapsed};}).ToArray();
                var start = data[0][0];
                var end = data[data.Length-1][0];
                var totalExecutionTime = (end-start)/60000;
                
                ResponseTimeChartDataSet dataset = new ResponseTimeChartDataSet();
                dataset.label = item.Key;
                dataset.borderColor = color;
                dataset.pointBorderColor = color;
                dataset.showLine = true;
                dataset.data = new ResponseTimeData[totalExecutionTime];
                int datasetDataIndex=0;
                for(int i=0;i<totalExecutionTime;i++){
                    var startTime = i*60000 + start;
                    var endTime = (i+1)*60000 + start;
                    var dataBetweenTime = sortedTimeStamp.Select(x => {
                            if(x.timeStamp >= startTime && x.timeStamp <=endTime)
                            {
                                xAxisLabel.Add(x.timeStamp);
                                return x.elapsed;
                            }
                            else{
                                return 0;
                            }
                        }).ToList();
                    dataBetweenTime = dataBetweenTime.Where(x => x>0).ToList();
                    if(dataBetweenTime.Count>0){
                        var avg = (dataBetweenTime.Aggregate((x,y)=> (x+y)))/dataBetweenTime.Count;
                        var parsedDate = ParseDate(((i*60000)+start),dtDateTime);
                        ResponseTimeData cordinates  = new ResponseTimeData();
                        cordinates.x = parsedDate;
                        cordinates.y = avg;
                        dataset.data[datasetDataIndex++] = cordinates; 
                    }
                }
                dataset.data = dataset.data.Where(x => x!=null).ToArray();
                datasets.Add(dataset);
                index++;
            }
            var tesRunStart = xAxisLabel.ElementAt(0);
            var tesRunEnd = xAxisLabel.ElementAt(xAxisLabel.Count -1);
            var totalTime = (tesRunEnd-tesRunStart)/60000; 
            List<string> parsedXAxisLabel = new List<string>();
            for(int i=0;i<totalTime;i++){
                var parsedDate = ParseDate(((i*60000)+tesRunStart),dtDateTime);
                parsedXAxisLabel.Add(parsedDate);
            }

            return new ResponseTimeVTime {
                labels = labels,
                xAxisLabel = parsedXAxisLabel.ToArray(),
                datasets = datasets.ToArray()
            };

        }

        

        public string ParseDate(long time, DateTime dtDateTime){  
            dtDateTime = dtDateTime.AddMilliseconds( time ).ToLocalTime();
            return dtDateTime.ToString("dd, hh:mm:ss", CultureInfo.InvariantCulture);
        }
    }
}