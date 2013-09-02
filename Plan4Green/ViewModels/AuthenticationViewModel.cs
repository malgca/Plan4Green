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
        [Required]
        public string Organisation { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [Display(Name = "Compare Password")]
        [Compare("Password", ErrorMessage = "The Password and Confirm Password fields must match")]
        public string ConfirmPassword { get; set; }
        public bool RememberMe { get; set; }
    }
}