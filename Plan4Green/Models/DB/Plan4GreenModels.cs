using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;

namespace Plan4Green.Models.DB
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
        public DbSet<OrganisationalUser> Users { get; set; }

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

    [Table("OrganisationalUser")]
    public class OrganisationalUser
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int User_ID { get; set; }
        public string UserName { get; set; }
        public string UserPassword { get; set; }

        [ForeignKey("Organisation_ID")]
        public string Organisation_Name { get; set; }

        public virtual Organisation Organisation_ID { get; set; }
    }

    [Table("Organisation")]
    public class Organisation
    {
        [Key]
        [Required]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public string Organisation_Name { get; set; }

        public virtual ICollection<OrganisationalUser> Users { get; set; }
        public virtual ICollection<Perspective> Perspectives { get; set; }
    }

    [Table("Perspective")]
    public class Perspective
    {
        [Key, Column(Order = 0)]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public string Perspective_Name { get; set; }
        
        public string Description { get; set; }
        public int X_Position { get; set; }
        public int Y_Position { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey("Assigned_Organisation")]
        public string Organisation_Name { get; set; }

        public virtual Organisation Assigned_Organisation { get; set; }
        public virtual ICollection<Goal> Goals { get; set; }
    }

    [Table("Goal")]
    public class Goal
    {
        [Key, Column(Order = 0)]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public string Goal_Name { get; set; }
        public string Description { get; set; }
        
        public string Start_Date { get; set; }
        public string Due_Date { get; set; }
        
        public int X_Position { get; set; }
        public int Y_Position { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey("Assigned_Perspective")]
        public string Perspective_Name { get; set; }

        [ForeignKey("Assigned_Perspective"), Column(Order = 2)]
        public string Organisation_Name { get; set; }

        public virtual Perspective Assigned_Perspective { get; set; }
        public virtual ICollection<Measure> Measures { get; set; }
    }

    [Table("Measure")]
    public class Measure
    {
        [Key, Column(Order = 0)]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public string Measure_Name { get; set; }
        public string Description { get; set; }

        public string Start_Date { get; set; }
        public string Due_Date { get; set; }

        public string Target_Value { get; set; }
        public string Organisation_Name { get; set; }

        public int X_Position { get; set; }
        public int Y_Position { get; set; }
        
        [Key, Column(Order = 1)]
        [ForeignKey("Assigned_Goal")]
        public string Goal_Name { get; set; }
        [ForeignKey("Assigned_Goal"), Column(Order = 2)]
        public string Perspective_Name { get; set; }

        public virtual Goal Assigned_Goal { get; set; }
        public virtual ICollection<Completion_Score> Completion_Score_Times { get; set; }
    }

    [Table("Completion_Score")]
    public class Completion_Score
    {
        [Key]
        [DataType(DataType.DateTime)]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public string Completion_Score_Time { get; set; }
        public double Current_Value { get; set; }

        [ForeignKey("Assigned_Measure"), Column(Order = 0)]
        public string Measure_Name { get; set; }
        [ForeignKey("Assigned_Measure"), Column(Order = 1)]
        public string Goal_Name { get; set; }
        public string Perspective_Name { get; set; }

        public virtual Measure Assigned_Measure { get; set; }
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

    public class OrganisationModel
    {
        [Required]
        public string Organisation_Name { get; set; }
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
