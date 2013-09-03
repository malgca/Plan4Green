using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Plan4Green.Models;

namespace Plan4Green.ViewModels
{
    public class AuthenticationViewModel
    {
        public LoginModel LoginModel { get; set; }
        public SignupModel SignupModel { get; set; }
    }
}