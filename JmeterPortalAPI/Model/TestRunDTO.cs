using System;
using System.Collections.Generic;
namespace Model
{
    public class TestRunDTO
    {
        public string TestName { get; set; }
        public string TestRunID { get; set; }
        public string Environment { get; set; }
        public string FileName { get; set; }
        public DateTime FileUploadDate { get; set; }
        public string FileStreamDataBase64 { get; set; }
    }
}