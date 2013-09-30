using Plan4Green.Models.DB;
using System.Collections.Generic;

namespace Plan4Green.Models.ViewModels
{
    public class PerspectiveViewModel
    {
        public string PerspectiveName { get; set; }
        public string Description { get; set; }
        public string OrganisationName { get; set; }
        
        public int xPosition { get; set; }
        public int yPosition { get; set; }

        public List<object> Children { get; set; }
    }
}