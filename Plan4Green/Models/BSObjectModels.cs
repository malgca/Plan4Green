using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Globalization;
using System.Web.Security;

namespace Plan4Green.Models
{
    public class BSObjectContext : DbContext
    {
        public BSObjectContext()
            : base("DefaultConnection")
        {
        }

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
