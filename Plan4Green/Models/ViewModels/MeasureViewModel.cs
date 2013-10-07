using Plan4Green.Models.DB;
using System;
using System.Collections.Generic;

namespace Plan4Green.Models.ViewModels
{
    public class MeasureViewModel
    {
        public string OldReference { get; set; }
        public string MeasureName { get; set; }
        public string Description { get; set; }
        public string OrganisationName { get; set; }

        public string StartDate { get; set; }
        public string DueDate { get; set; }

        public int xPosition { get; set; }
        public int yPosition { get; set; }
        
        public string targetValue { get; set; }
        public string ParentName { get; set; }
        public string GrandparentName { get; set; }
    }
}