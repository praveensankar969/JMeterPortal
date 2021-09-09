using System;
using System.Collections.Generic;
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
                dataset.pointColor = color;
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
    }
}