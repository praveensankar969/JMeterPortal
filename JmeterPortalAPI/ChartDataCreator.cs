using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Model;

namespace JmeterPortalAPI
{
    public class ChartDataCreator
    {
        private static TimeZoneInfo IST = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
        public ActualThreadVResponse ComputeActualResponseVThread(Dictionary<string, List<CsvModel>> dictionary, int responseTime, string op)
        {
            string[] labels = new string[dictionary.Count];
            List<int> xAxisLabel = new List<int>();
            List<ChartDataSet> datasets = new List<ChartDataSet>();
            int index = 0;
            string color = "";
            var random = new Random();
            if (op == "greater")
            {
                foreach (var item in dictionary)
                {
                    labels[index] = item.Key;
                    color = String.Format("#{0:X6}", random.Next(0x1000000));
                    List<CsvModel> sortedAllThread = item.Value;
                    sortedAllThread.Sort((x, y) => x.allThreads - y.allThreads);
                    ChartDataSet dataset = new ChartDataSet();
                    dataset.label = item.Key;
                    dataset.borderColor = color;
                    dataset.pointBorderColor = color;
                    dataset.showLine = false;
                    dataset.data = new List<int[]>();
                    for (int i = 0; i < sortedAllThread.Count; i++)
                    {
                        if (sortedAllThread.ElementAt(i).elapsed >= responseTime)
                        {
                            dataset.data.Add(new int[] { sortedAllThread.ElementAt(i).allThreads, sortedAllThread.ElementAt(i).elapsed });
                            xAxisLabel.Add(sortedAllThread.ElementAt(i).allThreads);
                        }
                    }
                    datasets.Add(dataset);
                    index++;
                }
            }
            else if (op == "lesser")
            {
                foreach (var item in dictionary)
                {
                    labels[index] = item.Key;
                    color = String.Format("#{0:X6}", random.Next(0x1000000));
                    List<CsvModel> sortedAllThread = item.Value;
                    sortedAllThread.Sort((x, y) => x.allThreads - y.allThreads);
                    ChartDataSet dataset = new ChartDataSet();
                    dataset.label = item.Key;
                    dataset.borderColor = color;
                    dataset.pointBorderColor = color;
                    dataset.showLine = false;
                    dataset.data = new List<int[]>();
                    for (int i = 0; i < sortedAllThread.Count; i++)
                    {
                        if (sortedAllThread.ElementAt(i).elapsed <= responseTime)
                        {
                            dataset.data.Add(new int[] { sortedAllThread.ElementAt(i).allThreads, sortedAllThread.ElementAt(i).elapsed });
                            xAxisLabel.Add(sortedAllThread.ElementAt(i).allThreads);
                        }
                    }
                    datasets.Add(dataset);
                    index++;
                }
            }

            xAxisLabel = xAxisLabel.Distinct().ToList();
            xAxisLabel.Sort((x, y) => x-y);

            return new ActualThreadVResponse
            {
                labels = labels,
                xAxisLabel = xAxisLabel.ToArray(),
                datasets = datasets.ToArray()
            };

        }
        public ActualThreadVResponse ComputeAverageResponseTimeVsThread(Dictionary<string, List<CsvModel>> dictionary, int responseTime, string op)
        {
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            string[] labels = new string[dictionary.Count];
            List<int> xAxisLabel = new List<int>();
            List<ChartDataSet> datasets = new List<ChartDataSet>();
            int index = 0;
            string color = "";
            var random = new Random();
            if (op == "greater")
            {
                foreach (var item in dictionary)
                {
                    labels[index] = item.Key;
                    color = String.Format("#{0:X6}", random.Next(0x1000000));
                    List<CsvModel> sortedAllThread = item.Value;
                    sortedAllThread.Sort((x, y) => x.allThreads - y.allThreads);
                    var totalThreads = sortedAllThread.ElementAt(sortedAllThread.Count - 1).allThreads;

                    ChartDataSet dataset = new ChartDataSet();
                    dataset.label = item.Key;
                    dataset.borderColor = color;
                    dataset.pointBorderColor = color;
                    dataset.showLine = true;
                    dataset.data = new List<int[]>();
                    for (int i = 1; i <= totalThreads; i++)
                    {
                        xAxisLabel.Add(i);
                        var threadsList = sortedAllThread.Where(x => x.allThreads == i).ToList();
                        var elapsedTimeList = threadsList.Select(x => { return x.elapsed; }).ToList();
                        if (elapsedTimeList.Count > 0)
                        {
                            var avg = elapsedTimeList.Aggregate((x, y) => x + y) / elapsedTimeList.Count;
                            if (avg >= responseTime)
                            {
                                var inte = new int[] { i, avg };
                                dataset.data.Add(inte);
                            }

                        }
                    }

                    datasets.Add(dataset);
                    index++;
                }
            }
            else if (op == "lesser")
            {
                foreach (var item in dictionary)
                {
                    labels[index] = item.Key;
                    color = String.Format("#{0:X6}", random.Next(0x1000000));
                    List<CsvModel> sortedAllThread = item.Value;
                    sortedAllThread.Sort((x, y) => x.allThreads - y.allThreads);
                    var totalThreads = sortedAllThread.ElementAt(sortedAllThread.Count - 1).allThreads;

                    ChartDataSet dataset = new ChartDataSet();
                    dataset.label = item.Key;
                    dataset.borderColor = color;
                    dataset.pointBorderColor = color;
                    dataset.showLine = true;
                    dataset.data = new List<int[]>();
                    for (int i = 1; i <= totalThreads; i++)
                    {
                        xAxisLabel.Add(i);
                        var threadsList = sortedAllThread.Where(x => x.allThreads == i).ToList();
                        var elapsedTimeList = threadsList.Select(x => { return x.elapsed; }).ToList();
                        if (elapsedTimeList.Count > 0)
                        {
                            var avg = elapsedTimeList.Aggregate((x, y) => x + y) / elapsedTimeList.Count;
                            if (avg <= responseTime)
                            {
                                var inte = new int[] { i, avg };
                                dataset.data.Add(inte);
                            }

                        }
                    }
                    datasets.Add(dataset);
                    index++;
                }
            }


            xAxisLabel = xAxisLabel.Distinct().ToList();
            xAxisLabel.Sort((x, y) => x-y);

            return new ActualThreadVResponse
            {
                labels = labels,
                xAxisLabel = xAxisLabel.ToArray(),
                datasets = datasets.ToArray()
            };

        }

        public ResponseTimeVTime ComputeActualResponseTimeVsTime(Dictionary<string, List<CsvModel>> dictionary, string timeFrom, string timeTo, int responseTime, string op)
        {
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            string[] labels = new string[dictionary.Count];
            List<long> xAxisLabel = new List<long>();
            List<ResponseTimeChartDataSet> datasets = new List<ResponseTimeChartDataSet>();
            int index = 0;
            string color = "";
            var random = new Random();
            var timeFilter = false;
            if (timeTo != null)
            {
                timeFilter = true;
            }
            if (op == "greater")
            {
                foreach (var item in dictionary)
                {
                    labels[index] = item.Key;
                    color = String.Format("#{0:X6}", random.Next(0x1000000));
                    List<CsvModel> sortedTimeStamp = item.Value;
                    sortedTimeStamp.Sort((x, y) => x.timeStamp.CompareTo(y.timeStamp));

                    ResponseTimeChartDataSet dataset = new ResponseTimeChartDataSet();
                    dataset.label = item.Key;
                    dataset.borderColor = color;
                    dataset.pointBorderColor = color;
                    dataset.showLine = false;
                    dataset.data = sortedTimeStamp.Select(val =>
                    {
                        var parsedDt = ParseDate(val.timeStamp, dtDateTime);
                        xAxisLabel.Add(val.timeStamp);
                        if (val.elapsed >= responseTime)
                        {
                            return new ResponseTimeData()
                            {
                                x = parsedDt,
                                y = val.elapsed
                            };
                        }
                        else
                        {
                            return null;
                        }
                    }).ToArray();
                    dataset.data = dataset.data.Where(x => x != null).ToArray();
                    if (timeFilter)
                        dataset.data = dataset.data.Where(d => d.x.CompareTo(timeFrom) >= 0 && d.x.CompareTo(timeTo) <= 0).ToArray();
                    datasets.Add(dataset);
                    index++;
                }
            }
            else if (op == "lesser")
            {
                foreach (var item in dictionary)
                {
                    labels[index] = item.Key;
                    color = String.Format("#{0:X6}", random.Next(0x1000000));
                    List<CsvModel> sortedTimeStamp = item.Value;
                    sortedTimeStamp.Sort((x, y) => x.timeStamp.CompareTo(y.timeStamp));

                    ResponseTimeChartDataSet dataset = new ResponseTimeChartDataSet();
                    dataset.label = item.Key;
                    dataset.borderColor = color;
                    dataset.pointBorderColor = color;
                    dataset.showLine = false;
                    dataset.data = sortedTimeStamp.Select(val =>
                    {
                        var parsedDt = ParseDate(val.timeStamp, dtDateTime);
                        xAxisLabel.Add(val.timeStamp);
                        if (val.elapsed <= responseTime)
                        {
                            return new ResponseTimeData()
                            {
                                x = parsedDt,
                                y = val.elapsed
                            };
                        }
                        else
                        {
                            return null;
                        }
                    }).ToArray();
                    dataset.data = dataset.data.Where(x => x != null).ToArray();
                    if (timeFilter)
                        dataset.data = dataset.data.Where(d => d.x.CompareTo(timeFrom) >= 0 && d.x.CompareTo(timeTo) <= 0).ToArray();
                    datasets.Add(dataset);
                    index++;
                }
            }


            xAxisLabel.Sort((x, y) => x.CompareTo(y));
            var parsedXAxisLabel = xAxisLabel.Select(x =>
            {
                return ParseDate(x, dtDateTime);
            }).ToList();
            parsedXAxisLabel = parsedXAxisLabel.Distinct().ToList();
            if (timeFilter)
                parsedXAxisLabel = parsedXAxisLabel.Where(d => d.CompareTo(timeFrom) >= 0 && d.CompareTo(timeTo) <= 0).ToList();

            return new ResponseTimeVTime
            {
                labels = labels,
                xAxisLabel = parsedXAxisLabel.ToArray(),
                datasets = datasets.ToArray()
            };

        }



        public ResponseTimeVTime ComputeAverageResponseTimeVsTime(Dictionary<string, List<CsvModel>> dictionary, string timeFrom, string timeTo, int responseTime, string op)
        {
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 5, 0, 0);
            string[] labels = new string[dictionary.Count];
            List<long> xAxisLabel = new List<long>();
            List<ResponseTimeChartDataSet> datasets = new List<ResponseTimeChartDataSet>();
            int index = 0;
            string color = "";
            var random = new Random();
            var timeFilter = false;
            if (timeTo != null)
            {
                timeFilter = true;
            }
            if (op == "greater")
            {
                foreach (var item in dictionary)
                {
                    labels[index] = item.Key;
                    color = String.Format("#{0:X6}", random.Next(0x1000000));
                    List<CsvModel> sortedTimeStamp = item.Value;
                    sortedTimeStamp.Sort((x, y) => x.timeStamp.CompareTo(y.timeStamp));
                    var data = sortedTimeStamp.Select(x => { return new long[] { x.timeStamp, x.elapsed }; }).ToArray();
                    var start = data[0][0];
                    var end = data[data.Length - 1][0];
                    var totalExecutionTime = (end - start) / 60000;

                    ResponseTimeChartDataSet dataset = new ResponseTimeChartDataSet();
                    dataset.label = item.Key;
                    dataset.borderColor = color;
                    dataset.pointBorderColor = color;
                    dataset.showLine = true;
                    dataset.data = new ResponseTimeData[totalExecutionTime];
                    int datasetDataIndex = 0;
                    for (int i = 0; i < totalExecutionTime; i++)
                    {
                        var startTime = i * 60000 + start;
                        var endTime = (i + 1) * 60000 + start;
                        var dataBetweenTime = sortedTimeStamp.Select(x =>
                        {
                            if (x.timeStamp >= startTime && x.timeStamp <= endTime)
                            {
                                return x.elapsed;
                            }
                            else
                            {
                                return 0;
                            }
                        }).ToList();
                        dataBetweenTime = dataBetweenTime.Where(x => x > 0).ToList();
                        if (dataBetweenTime.Count > 0)
                        {
                            var avg = (dataBetweenTime.Aggregate((x, y) => (x + y))) / dataBetweenTime.Count;
                            if (avg >= responseTime)
                            {
                                var parsedDate = ParseDate(((i * 60000) + start), dtDateTime);
                                ResponseTimeData cordinates = new ResponseTimeData();
                                cordinates.x = parsedDate;
                                cordinates.y = avg;
                                dataset.data[datasetDataIndex++] = cordinates;
                                var longN = (i * 60000) + start;
                                xAxisLabel.Add(longN);
                            }
                        }
                    }
                    dataset.data = dataset.data.Where(x => x != null).ToArray();
                    if (timeFilter)
                        dataset.data = dataset.data.Where(d => d.x.CompareTo(timeFrom) >= 0 && d.x.CompareTo(timeTo) <= 0).ToArray();
                    datasets.Add(dataset);
                    index++;
                }
            }
            else
            {
                foreach (var item in dictionary)
                {
                    labels[index] = item.Key;
                    color = String.Format("#{0:X6}", random.Next(0x1000000));
                    List<CsvModel> sortedTimeStamp = item.Value;
                    sortedTimeStamp.Sort((x, y) => x.timeStamp.CompareTo(y.timeStamp));
                    var data = sortedTimeStamp.Select(x => { return new long[] { x.timeStamp, x.elapsed }; }).ToArray();
                    var start = data[0][0];
                    var end = data[data.Length - 1][0];
                    var totalExecutionTime = (end - start) / 60000;

                    ResponseTimeChartDataSet dataset = new ResponseTimeChartDataSet();
                    dataset.label = item.Key;
                    dataset.borderColor = color;
                    dataset.pointBorderColor = color;
                    dataset.showLine = true;
                    dataset.data = new ResponseTimeData[totalExecutionTime];
                    int datasetDataIndex = 0;
                    for (int i = 0; i < totalExecutionTime; i++)
                    {
                        var startTime = i * 60000 + start;
                        var endTime = (i + 1) * 60000 + start;
                        var dataBetweenTime = sortedTimeStamp.Select(x =>
                        {
                            if (x.timeStamp >= startTime && x.timeStamp <= endTime)
                            {
                                return x.elapsed;
                            }
                            else
                            {
                                return 0;
                            }
                        }).ToList();
                        dataBetweenTime = dataBetweenTime.Where(x => x > 0).ToList();
                        if (dataBetweenTime.Count > 0)
                        {
                            var avg = (dataBetweenTime.Aggregate((x, y) => (x + y))) / dataBetweenTime.Count;
                            if (avg <= responseTime)
                            {
                                var parsedDate = ParseDate(((i * 60000) + start), dtDateTime);
                                ResponseTimeData cordinates = new ResponseTimeData();
                                cordinates.x = parsedDate;
                                cordinates.y = avg;
                                dataset.data[datasetDataIndex++] = cordinates;
                                var longN = (i * 60000) + start;
                                xAxisLabel.Add(longN);
                            }
                        }
                    }
                    dataset.data = dataset.data.Where(x => x != null).ToArray();
                    if (timeFilter)
                        dataset.data = dataset.data.Where(d => d.x.CompareTo(timeFrom) >= 0 && d.x.CompareTo(timeTo) <= 0).ToArray();
                    datasets.Add(dataset);
                    index++;
                }
            }

            xAxisLabel.Sort((x, y) => x.CompareTo(y));
            var parsedXAxisLabel = xAxisLabel.Select(x =>
            {
                return ParseDate(x, dtDateTime);
            }).ToList();
            parsedXAxisLabel = parsedXAxisLabel.Distinct().ToList();
            if (timeFilter)
                parsedXAxisLabel = parsedXAxisLabel.Where(d => d.CompareTo(timeFrom) >= 0 && d.CompareTo(timeTo) <= 0).ToList();
            return new ResponseTimeVTime
            {
                labels = labels,
                xAxisLabel = parsedXAxisLabel.ToArray(),
                datasets = datasets.ToArray()
            };

        }

        public PercentileChart ComputePercentile(Dictionary<string, List<CsvModel>> dictionary, int responseTime, string op)
        {
            string[] labels = new string[dictionary.Count];
            List<int> xAxisLabel = new List<int>();
            List<PercentileChartDataSet> datasets = new List<PercentileChartDataSet>();
            int index = 0;
            string color = "";
            var random = new Random();
            if (op == "greater")
            {
                foreach (var item in dictionary)
                {
                    labels[index] = item.Key;
                    color = String.Format("#{0:X6}", random.Next(0x1000000));
                    List<CsvModel> sortedPercentile = item.Value;
                    sortedPercentile.Sort((x, y) => x.elapsed - y.elapsed);
                    PercentileChartDataSet dataset = new PercentileChartDataSet();
                    dataset.label = item.Key;
                    dataset.borderColor = color;
                    dataset.pointBorderColor = color;
                    dataset.showLine = true;
                    dataset.data = new double[sortedPercentile.Count][];
                    for (int i = 0; i < sortedPercentile.Count; i++)
                    {
                        if (sortedPercentile.ElementAt(i).elapsed >= responseTime)
                            dataset.data[i] = new double[] { Math.Round((((double)i / sortedPercentile.Count) * 100), 1), sortedPercentile.ElementAt(i).elapsed };

                    }
                    datasets.Add(dataset);
                    index++;
                }
            }
            else if (op == " lesser")
            {
                foreach (var item in dictionary)
                {
                    labels[index] = item.Key;
                    color = String.Format("#{0:X6}", random.Next(0x1000000));
                    List<CsvModel> sortedPercentile = item.Value;
                    sortedPercentile.Sort((x, y) => x.elapsed - y.elapsed);
                    PercentileChartDataSet dataset = new PercentileChartDataSet();
                    dataset.label = item.Key;
                    dataset.borderColor = color;
                    dataset.pointBorderColor = color;
                    dataset.showLine = true;
                    dataset.data = new double[sortedPercentile.Count][];
                    for (int i = 0; i < sortedPercentile.Count; i++)
                    {
                        if (sortedPercentile.ElementAt(i).elapsed <= responseTime)
                            dataset.data[i] = new double[] { Math.Round((((double)i / sortedPercentile.Count) * 100), 1), sortedPercentile.ElementAt(i).elapsed };

                    }
                    datasets.Add(dataset);
                    index++;
                }
            }


            return new PercentileChart
            {
                labels = labels,
                xAxisLabel = xAxisLabel.ToArray(),
                datasets = datasets.ToArray()
            };

        }

        public string ParseDate(long time, DateTime dtDateTime)
        {
            DateTime dt = new DateTime(1970, 1, 1, 0, 0, 0).Add(TimeSpan.FromMilliseconds(time));
            dt = TimeZoneInfo.ConvertTimeFromUtc(dt, IST);
            return dt.ToString("dd, HH:mm", CultureInfo.InvariantCulture);
        }
    }
}