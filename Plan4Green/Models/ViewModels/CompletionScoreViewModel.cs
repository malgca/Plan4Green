using Plan4Green.Models.DB;
using System;
using System.Collections.Generic;

namespace Plan4Green.Models.ViewModels
{
    public class CompletionScoreViewModel
    {
        public DateTime CompletionScoreTime { get; set; }
        public double CurrentValue { get; set; }
        public string ParentName { get; set; }
        public string GrandparentName { get; set; }
    }
}