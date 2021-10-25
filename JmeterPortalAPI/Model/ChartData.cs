using System.Collections.Generic;

namespace Model{
    public class ChartData{
        public Dictionary<string, List<CsvModel>> data {get; set;}
        public long startTime {get; set;}
        public long endTime {get; set;}
    }
}