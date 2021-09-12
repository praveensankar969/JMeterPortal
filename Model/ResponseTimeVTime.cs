namespace Model
{
    public class ResponseTimeVTime
    {
        public string[] labels { get; set; }    
        public string[] xAxisLabel { get; set; }
        public ResponseTimeChartDataSet[] datasets { get; set; }
    }
}