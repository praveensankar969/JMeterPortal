using System;
using System.Collections.Generic;
using System.Linq;
using Model;

namespace JmeterPortalAPI.Services{
    public class AggregateReportCreator{
        public List<AggregrateModel> CreateReport(Dictionary<string, List<CsvModel>> dictionary,string[] labels, long start, long end){
            
            List<AggregrateModel> datasets = new List<AggregrateModel>();
            Dictionary<string, List<CsvModel>> dictionaryFiltered = new Dictionary<string, List<CsvModel>>();
            foreach (var item in labels)
            {
                dictionaryFiltered.Add(item, dictionary[item]);
            }
            foreach (var item in dictionaryFiltered)
            {
                var data = new AggregrateModel();
                data.label = item.Key;
                List<CsvModel> sortedTimeStamp = item.Value.Where(_ => (_.timeStamp.CompareTo(start) >= 0 && _.timeStamp.CompareTo(end) < 1)).ToList();
                data.samples = sortedTimeStamp.Count;
                var elasped = sortedTimeStamp.Select(x=> x.elapsed).ToList();
                data.average = (int)sortedTimeStamp.Select(x=> x.elapsed).Average();
                data.min = elasped.Min();
                data.max = elasped.Max();
                elasped.Sort((x,y) => y-x);
                if(elasped.Count % 2==0){
                    var arr = elasped.ToArray();
                    data.median = (arr[(elasped.Count/2)-1] + arr[elasped.Count/2])/2;
                }
                else{
                    data.median = elasped.ToArray()[elasped.Count/2]/1;
                }
                var err = sortedTimeStamp.Select(x=> x.errorCount);
                data.error = Math.Round(((double)err.Sum()/(double)err.Count())*100, 2);
                var percentile = new Percentile();
                
                var elaspedCopy = new List<int>(elasped);
                elaspedCopy.RemoveRange(0, (elasped.Count*3/100));
                percentile.ninetySeven = elaspedCopy.Max();
                
                elaspedCopy = new List<int>(elasped);
                elaspedCopy.RemoveRange(0, (elasped.Count*10/100));
                percentile.ninety = elaspedCopy.Max();

                elaspedCopy = new List<int>(elasped);
                elaspedCopy.RemoveRange(0, (elasped.Count*15/100));
                percentile.eightyFive = elaspedCopy.Max();

                elaspedCopy = new List<int>(elasped);
                elaspedCopy.RemoveRange(0, (elasped.Count*20/100));
                percentile.eighty = elaspedCopy.Max();

                elaspedCopy = new List<int>(elasped);
                elaspedCopy.RemoveRange(0, (elasped.Count*30/100));
                percentile.seventy = elaspedCopy.Max();

                elaspedCopy = new List<int>(elasped);
                elaspedCopy.RemoveRange(0, (elasped.Count*40/100));
                percentile.sixty = elaspedCopy.Max();

                data.percentile = percentile;
                datasets.Add(data);
            }

            return datasets;
        }

        public bool CheckPresence(string[] labels, string label){
            return labels.FirstOrDefault(x=> x == label).Length>0;
        }
    }
}
