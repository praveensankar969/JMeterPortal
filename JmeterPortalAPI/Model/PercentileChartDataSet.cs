namespace Model{
    public class PercentileChartDataSet{
        public string label {get; set;}
        public double[][] data { get; set; }
        public string borderColor { get; set; }
        public string pointBorderColor { get; set; }
        public bool showLine { get; set; }
    }
}