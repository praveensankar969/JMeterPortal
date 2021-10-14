namespace Model
{
    public class PercentileChart
    {
        public string[] labels { get; set; }    
        public int[] xAxisLabel { get; set; }
        public PercentileChartDataSet[] datasets { get; set; }
    }
}