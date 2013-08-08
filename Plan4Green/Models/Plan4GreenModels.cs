using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Globalization;
using System.Web.Security;

namespace Plan4Green.Models
{
    public class Plan4GreenDB : DbContext
    {
        public Plan4GreenDB()
            : base("Plan4GreenDB")
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

        /// <summary>
        /// Perspectives Dataset.
        /// </summary>
        public DbSet<Perspective> Perspectives { get; set; }

        /// <summary>
        /// Goals Dataset.
        /// </summary>
        public DbSet<Goal> Goals { get; set; }
        
        /// <summary>
        /// Measures Dataset.
        /// </summary>
        public DbSet<Measure> Measures { get; set; }
        
        /// <summary>
        /// Completion Score Dataset.
        /// </summary>
        public DbSet<Completion_Score> Completion_Scores { get; set; }
    }

    #region Tables

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

    [Table("Perspective")]
    public class Perspective
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public string Perspective_Name { get; set; }
        public string Description { get; set; }
        
        [Column("Organisation_Name")]
        [ForeignKey("Organisation_Name")]
        public string Organisation_ID { get; set; }

        public virtual Organisation Organisation_Name { get; set; }
        public virtual ICollection<Goal> Goals { get; set; }
    }

    [Table("Goal")]
    public class Goal
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Goal_ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        
        [DataType(DataType.Date)]
        public DateTime Start_Date { get; set; }
        
        [DataType(DataType.Date)]
        public DateTime Due_Date { get; set; }
        
        public string Target_Value { get; set; }

        [Column("Perspective_Name")]
        [ForeignKey("Perspective_Name")]
        public string Assigned_Perspective { get; set; }

        public virtual Perspective Perspective_Name { get; set; }
        public virtual ICollection<Measure> Measures { get; set; }
    }

    [Table("Measure")]
    public class Measure
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Measure_ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        [DataType(DataType.Date)]
        public DateTime Start_Date { get; set; }

        [DataType(DataType.Date)]
        public DateTime Due_Date { get; set; }

        public string Target_Value { get; set; }

        [Column("Goal_ID")]
        [ForeignKey("Goal_ID")]
        public int Assigned_Goal { get; set; }

        public virtual Goal Goal_ID { get; set; }
        public virtual ICollection<Completion_Score> Completion_Score_Times { get; set; }
    }

    [Table("Completion_Score")]
    public class Completion_Score
    {
        [Key]
        [DataType(DataType.DateTime)]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public DateTime Completion_Score_Time { get; set; }
        public string Current_Value { get; set; }

        [Column("Measure_ID")]
        [ForeignKey("Measure_ID")]
        public int Assigned_Measure { get; set; }

        public virtual Measure Measure_ID { get; set; }
    }
#endregion

    #region Models

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
        public string Organisation { get; set; }

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

    public class PerspectiveModel
    {
        [Required]
        [Display(Name = "Perspective Name")]
        public string Perspective_Name { get; set; }

        [Required]
        [Display(Name = "Description")]
        public string Description { get; set; }
    }

    public class GoalModel
    {
        [Required]
        [Display(Name = "Goal Name")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Description")]
        public string Description{ get; set; }

        [Display(Name = "Start Date")]
        public DateTime Start_Date { get; set; }

        [Display(Name = "Due Date")]
        public DateTime Due_Date { get; set; }

        [Required]
        [Display(Name = "Target Value")]
        public string Target_Value { get; set; }
    }

    public class MeasureModel
    {
        [Required]
        [Display(Name = "Measure Name")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Description")]
        public string Description { get; set; }

        [Display(Name = "Start Date")]
        public DateTime Start_Date { get; set; }

        [Display(Name = "Due Date")]
        public DateTime Due_Date { get; set; }

        [Required]
        [Display(Name = "Target Value")]
        public string Target_Value { get; set; }
    }

    #endregion
}
