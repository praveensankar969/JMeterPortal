namespace Model{
    public class AggregrateModel{
        public string label { get; set; }
        public int samples { get; set; }
        public int average { get; set; }  
        public int median { get; set; }
        public Percentile percentile { get; set; }  
        public int min { get; set; }
        public int max { get; set; }
        public double error { get; set; }

    }

    public class LabelModel{
        public string labels { get; set; }
    }
}