using System.Collections.Generic;

namespace Model{
    public class ChartDataSet{
        public string label {get; set;}
        public List<int[]> data { get; set; }
        public string borderColor { get; set; }
        public string pointBorderColor { get; set; }
        public bool showLine { get; set; }
    }
}