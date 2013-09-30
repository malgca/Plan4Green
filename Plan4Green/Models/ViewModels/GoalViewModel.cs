using Plan4Green.Models.DB;
using System.Collections.Generic;

namespace Plan4Green.Models.ViewModels
{
    public class GoalViewModel
    {
        public string GoalName { get; set; }
        public string Description { get; set; }

        public string StartDate { get; set; }
        public string DueDate { get; set; }

        public int xPosition { get; set; }
        public int yPosition { get; set; }

        public string Parent { get; set; }
        public string OrganisationName { get; set; }

        public List<object> Children { get; set; }
    }
}