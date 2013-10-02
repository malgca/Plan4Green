using Plan4Green.Models.DB;
using Plan4Green.Models.ViewModels;
using System.Collections.Generic;
using System.Linq;

namespace Plan4Green.Models.ObjectManager
{
    /// <summary>
    /// Manages Goal operations on the Database.
    /// </summary>
    public class GoalManager
    {
        /// <summary>
        /// Get's the goals associated with an Organisation from a database.
        /// </summary>
        /// <param name="organisationName"></param>
        public List<Goal> GetGoals(string organisationName)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                return (
                    from goal in context.Goals
                    where goal.Organisation_Name == organisationName
                    select goal).ToList();
            }
        }

        /// <summary>
        /// Add an organisation to the Database
        /// </summary>
        /// <param name="organisation">The name of the Organisation to be added.</param>
        public void AddGoal(GoalViewModel gvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (!GoalExists(context, gvm.GoalName, gvm.ParentName))
                {
                    Goal newGoal = new Goal();

                    newGoal.Goal_Name = gvm.GoalName;
                    newGoal.Description = gvm.Description;
                    newGoal.Organisation_Name = gvm.OrganisationName;
                    newGoal.X_Position = gvm.xPosition;
                    newGoal.Y_Position = gvm.yPosition;
                    newGoal.Start_Date = gvm.StartDate;
                    newGoal.Due_Date = gvm.DueDate;
                    newGoal.Perspective_Name = gvm.ParentName;

                    context.Goals.Add(newGoal);
                    context.SaveChanges();
                }
            }
        }

        /// <summary>
        /// Updates information on a Goal in the Database.
        /// </summary>
        /// <param name="Goal">The Goal to be updated in the Database.</param>
        public void UpdateGoal(GoalViewModel gvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                // case for changing names
                if (GoalExists(context, gvm.OldReference, gvm.ParentName))
                {
                    Goal workingGoal = (from goal in context.Goals
                                        where goal.Goal_Name == gvm.OldReference
                                        select goal).First();

                    if (workingGoal.Goal_Name != gvm.GoalName)
                    {
                        context.Goals.Remove(workingGoal);
                        AddGoal(gvm);
                        context.SaveChanges();
                        return;
                    }
                }
                if (GoalExists(context, gvm.GoalName, gvm.ParentName))
                {
                    Goal workingGoal = (from goal in context.Goals
                                        where goal.Goal_Name == gvm.GoalName
                                        select goal).First();

                    if (workingGoal.Description != gvm.Description)
                    {
                        workingGoal.Description = gvm.Description;
                    }
                    if (workingGoal.X_Position != gvm.xPosition)
                    {
                        workingGoal.X_Position = gvm.xPosition;
                    }
                    if (workingGoal.Y_Position != gvm.yPosition)
                    {
                        workingGoal.Y_Position = gvm.yPosition;
                    }
                    if (workingGoal.Start_Date != gvm.StartDate)
                    {
                        workingGoal.Start_Date = gvm.StartDate;
                    }
                    if (workingGoal.Due_Date != gvm.DueDate)
                    {
                        workingGoal.Due_Date = gvm.DueDate;
                    }
                }

                context.SaveChanges();
            }
        }

        // Check if a Goal already exists in the database.
        private bool GoalExists(Plan4GreenDB context, string goalName, string perspectiveName)
        {
            return (
                from goal in context.Goals
                where goal.Goal_Name.Equals(goalName)
                && goal.Perspective_Name.Equals(perspectiveName)
                select goal).Any();
        }
    }
}