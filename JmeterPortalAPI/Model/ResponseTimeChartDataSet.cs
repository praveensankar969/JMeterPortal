namespace Model{
    public class ResponseTimeChartDataSet{
        public string label {get; set;}
        public ResponseTimeData[] data { get; set; }
        public string borderColor { get; set; }
        public string pointBorderColor { get; set; }
        public bool showLine { get; set; }
    }
}