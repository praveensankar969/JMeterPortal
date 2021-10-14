using System;
using System.Collections.Generic;
namespace Model
{
    public class TestRun
    {
        public string Id { get; set; }
        public string TestName { get; set; }
        public string TestRunID { get; set; }
        public string Environment { get; set; }
        public string FileName { get; set; }
        public DateTime FileUploadDate { get; set; }
        public byte[] FileStreamData { get; set; }
    }
}