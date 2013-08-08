using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Plan4Green.Models;

namespace Plan4Green.ViewModels
{
    public class BSObjectViewModel
    {
        public IEnumerable<PerspectiveModel> Perspectives { get; set; }
        public IEnumerable<GoalModel> Goals { get; set; }
        public IEnumerable<MeasureModel> Measures { get; set; }
    }
}