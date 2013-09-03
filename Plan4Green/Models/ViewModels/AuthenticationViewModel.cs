using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Plan4Green.Models.DB;

namespace Plan4Green.Models.ViewModels
{
    public class AuthenticationViewModel
    {
        public OrganisationModel OrganisationModel { get; set; }
        public LoginModel LoginModel { get; set; }
        public SignupModel SignupModel { get; set; }
    }
}