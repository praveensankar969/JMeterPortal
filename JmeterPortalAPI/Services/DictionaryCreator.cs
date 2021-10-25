using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using JmeterPortalAPI.PersistenceHandler;
using Microsoft.Extensions.Configuration;
using Model;

namespace JmeterPortalAPI.Services{
    public class DictionaryCreator{
        private readonly IConfiguration config;
        
        public DictionaryCreator(IConfiguration config)
        {
            this.config = config;
        }
        public async Task<ChartData> GetMap(string id){
            SQLProcedure procedure = new SQLProcedure(this.config);
            TestRun res = await procedure.GetDataOfId(id);
            List<CsvModel> data = new List<CsvModel>();
            Dictionary<string, List<CsvModel>> dictionary = new Dictionary<string, List<CsvModel>>();
            if(res !=null){
                string decodedString = System.Text.ASCIIEncoding.ASCII.GetString(res.FileStreamData);
                string[] allRecords = decodedString.Split("\n");
                for(int i=1;i<allRecords.Length-1;i++){
                    string[] record = Regex.Split(allRecords[i], "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                    var label = record[2];
                    CsvModel cm = new CsvModel();
                    cm.timeStamp = Convert.ToInt64(record[0]);
                    cm.elapsed = Convert.ToInt32(record[1]);
                    cm.allThreads = Convert.ToInt32(record[12]);
                    data.Add(cm);

                    if(dictionary.ContainsKey(label)){
                        List<CsvModel> copyModel = new List<CsvModel>();
                        dictionary.TryGetValue(label, out copyModel);
                        copyModel.Add(cm);
                        dictionary.Remove(label);
                        dictionary.Add(label, copyModel);
                    }
                    else{
                        dictionary.Add(label, new List<CsvModel>() {cm});
                    }
                }
                 
                var startTime = dictionary.First().Value.First().timeStamp;
                var endTime = dictionary.Last().Value.Last().timeStamp;
                return new ChartData {
                    data = dictionary,
                    startTime = startTime,
                    endTime = endTime
                };
            }
            else{
                return null;
            }
        }
    }
}