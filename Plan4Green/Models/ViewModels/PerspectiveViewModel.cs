using Plan4Green.Models.DB;
using System.Collections.Generic;

namespace Plan4Green.Models.ViewModels
{
    public class PerspectiveViewModel
    {
        private string _perspectiveName;
        private string _oldReference;

        public string OldReference 
        {
            get
            {
                if (_oldReference == string.Empty)
                {
                    _oldReference = _perspectiveName;
                }

                return _oldReference;
            }
            private set
            {
                if (_oldReference != value)
                {
                    _oldReference = value;
                }
            }
        }
        public string PerspectiveName
        {
            get
            {
                return _perspectiveName;
            }
            set 
            {
                if (value != _perspectiveName)
                {
                    OldReference = _perspectiveName;
                    _perspectiveName = value;
                }
            }
        }
        public string Description { get; set; }
        public string OrganisationName { get; set; }
        
        public int xPosition { get; set; }
        public int yPosition { get; set; }

        public List<object> Children { get; set; }
    }
}