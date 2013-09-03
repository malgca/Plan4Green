using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Plan4Green.Models.DB;

namespace Plan4Green.Models.ViewModels
{
    public class BSObjectViewModel
    {
        public IEnumerable<OrganisationModel> Organisations { get; set; }
        public IEnumerable<PerspectiveModel> Perspectives { get; set; }
        public IEnumerable<GoalModel> Goals { get; set; }
        public IEnumerable<MeasureModel> Measures { get; set; }
    }
}