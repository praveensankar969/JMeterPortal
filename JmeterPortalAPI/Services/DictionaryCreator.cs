using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using JmeterPortalAPI.PersistenceHandler;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Model;

namespace JmeterPortalAPI.Services
{
    public class DictionaryCreator
    {
        private readonly IConfiguration config;
        public DictionaryCreator(IConfiguration config)
        {
            this.config = config;
        }
        
        private readonly DataContext _context;

        public DictionaryCreator(DataContext _context)
        {
            this._context = _context;
        }
        public async Task<Dictionary<string, List<CsvModel>>> GetMap(string id)
        {
            Guid guid;
            if (Guid.TryParse(id, out guid))
            {
                TestRun res = await this._context.TestRuns.FirstOrDefaultAsync(x => x.Id == guid);
                List<CsvModel> data = new List<CsvModel>();
                Dictionary<string, List<CsvModel>> dictionary = new Dictionary<string, List<CsvModel>>();
                if (res != null)
                {
                    string decodedString = System.Text.ASCIIEncoding.ASCII.GetString(res.FileStreamData);
                    string[] allRecords = decodedString.Split("\n");
                    for (int i = 1; i < allRecords.Length - 1; i++)
                    {
                        string[] record = Regex.Split(allRecords[i], "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                        CsvModel cm = new CsvModel();
                        cm.timeStamp = Convert.ToInt64(record[0]);
                        cm.elapsed = Convert.ToInt32(record[1]);
                        cm.label = record[2];
                        cm.allThreads = Convert.ToInt32(record[12]);
                        data.Add(cm);

                        if (dictionary.ContainsKey(cm.label))
                        {
                            List<CsvModel> copyModel = new List<CsvModel>();
                            dictionary.TryGetValue(cm.label, out copyModel);
                            copyModel.Add(cm);
                            copyModel.Sort((x, y) => x.timeStamp.CompareTo(y.timeStamp));
                            dictionary.Remove(cm.label);
                            dictionary.Add(cm.label, copyModel);
                        }
                        else
                        {
                            dictionary.Add(cm.label, new List<CsvModel>() { cm });
                        }
                    }
                    return dictionary;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }

        }
    }
}