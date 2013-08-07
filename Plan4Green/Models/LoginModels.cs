using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Globalization;
using System.Web.Security;

namespace Plan4Green.Models
{
    public class LoginContext : DbContext
    {
        public LoginContext()
            : base("DefaultConnection")
        {
        }

        /// <summary>
        /// User Dataset.
        /// </summary>
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// Organisation Dataset.
        /// </summary>
        public DbSet<Organisation> Organisations { get; set; }
    }

    [Table("User")]
    public class User
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int User_ID { get; set; }
        public string UserName { get; set; }
        public string UserPassword { get; set; }
        
        [Column("Organisation_Name")]
        [ForeignKey("Organisation_Name")]
        public string Organisation_ID { get; set; }

        public virtual Organisation Organisation_Name { get; set; }
    }

    [Table("Organisation")]
    public class Organisation
    {
        [Key]
        [Required]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public string Organisation_Name { get; set; }

        public virtual ICollection<User> Users { get; set; }
        public virtual ICollection<Perspective> Perspectives { get; set; }
    }
    
    public class LocalPasswordModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current Password")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New Password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm New Password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class LoginModel
    {
        [Required]
        [Display(Name = "User Name")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }

    public class SignupModel
    {
        [Required]
        [Display(Name = "Organisation")]
        public string Organisation{ get; set; }

        [Required]
        [Display(Name = "User Name")]
        public string UserName { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm Password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}
