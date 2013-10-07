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
        public List<Goal> GetGoalsByOrganisation(string organisationName)
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
        /// Get the List of Goals belonging to a single Perspective.
        /// </summary>
        public List<GoalViewModel> GetGoalsByPerspective(PerspectiveViewModel pvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                List<Goal> goals = (from goal in context.Goals
                                                  where goal.Perspective_Name == pvm.OldReference
                                                  && goal.Organisation_Name == pvm.OrganisationName
                                                  select goal).ToList();

                List<GoalViewModel> gvms = new List<GoalViewModel>();

                foreach (Goal goal in goals)
                {
                    gvms.Add(ExtractViewModel(goal));
                }

                return gvms;
            }
        }

        /// <summary>
        /// Add an organisation to the Database
        /// </summary>
        public void AddGoal(GoalViewModel gvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (!GoalExists(context, gvm))
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
                if (GoalExists(context, gvm))
                {
                    Goal workingGoal = (from goal in context.Goals
                                        where goal.Goal_Name == gvm.GoalName
                                        && goal.Organisation_Name == gvm.OrganisationName
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

                    context.SaveChanges();
                    return;
                }
                else
                {
                    // get a list of items with the old reference.
                    Goal workingGoal = (from goal in context.Goals
                                        where goal.Goal_Name == gvm.OldReference
                                        && goal.Perspective_Name == gvm.ParentName
                                        && goal.Organisation_Name == gvm.OrganisationName
                                        select goal).FirstOrDefault();

                    if(workingGoal != default(Goal))
                    {
                        UpdateName(gvm, workingGoal);
                    }
                    return;
                }
            }
        }

        /// <summary>
        /// Deletes a measure from the Database
        /// </summary>
        public void DeleteGoal(GoalViewModel gvm, bool deleteByOldReference = false)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                Goal deleteGoal;

                if(deleteByOldReference)
                {
                    deleteGoal = (from goal in context.Goals
                                       where goal.Perspective_Name == gvm.ParentName
                                       && goal.Goal_Name == gvm.OldReference
                                       && goal.Organisation_Name == gvm.OrganisationName
                                       select goal).FirstOrDefault();
                }
                else
                {
                    deleteGoal = (from goal in context.Goals
                                  where goal.Perspective_Name == gvm.ParentName
                                  && goal.Goal_Name == gvm.GoalName
                                  && goal.Organisation_Name == gvm.OrganisationName
                                  select goal).FirstOrDefault();
                }

                if (deleteGoal != default(Goal))
                {
                    context.Goals.Remove(deleteGoal);
                    context.SaveChanges();
                }
            }
        }

        // Extracts the view model from a given measure in the Database
        private GoalViewModel ExtractViewModel(Goal goal)
        {
            GoalViewModel gvm = new GoalViewModel();

            gvm.Description = goal.Description;
            gvm.DueDate = goal.Due_Date;
            gvm.GoalName = goal.Goal_Name;
            gvm.OrganisationName = goal.Organisation_Name;
            gvm.ParentName = goal.Goal_Name;
            gvm.StartDate = goal.Start_Date;
            gvm.xPosition = goal.X_Position;
            gvm.yPosition = goal.Y_Position;

            return gvm;
        }

        // update a perspectives name.
        private void UpdateName(GoalViewModel gvm, Goal workingGoal)
        {
            //TODO: Fix this method
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                MeasureManager mm = new MeasureManager();
                CompletionScoreManager csm = new CompletionScoreManager();

                List<MeasureViewModel> mvms = mm.GetMeasuresByGoal(gvm);
                List<CompletionScoreViewModel> csvms = csm.GetCompletionScoresByGoal(gvm);

                foreach (CompletionScoreViewModel csvm in csvms)
                {
                    csm.DeleteCompletionScore(csvm);
                }

                foreach (MeasureViewModel mvm in mvms)
                {
                    mm.DeleteMeasure(mvm);
                }

                DeleteGoal(gvm, true);
                AddGoal(gvm);

                foreach (MeasureViewModel mvm in mvms)
                {
                    mvm.ParentName = gvm.GoalName;
                    mm.AddMeasure(mvm);
                }

                foreach (CompletionScoreViewModel csvm in csvms)
                {
                    csvm.GrandparentName = gvm.GoalName;
                    csm.AddCompletionScore(csvm);
                }
            }
        }

        // Check if a Goal already exists in the database.
        private bool GoalExists(Plan4GreenDB context, GoalViewModel gvm)
        {
            return (
                from goal in context.Goals
                where goal.Goal_Name == gvm.GoalName
                && goal.Perspective_Name == gvm.ParentName
                && goal.Organisation_Name == gvm.OrganisationName
                select goal).Any();
        }
    }
}