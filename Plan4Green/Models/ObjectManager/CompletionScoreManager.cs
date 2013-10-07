using Plan4Green.Models.DB;
using Plan4Green.Models.ViewModels;
using System.Collections.Generic;
using System.Linq;

namespace Plan4Green.Models.ObjectManager
{
    /// <summary>
    /// Manages Completion Score operations on the Database.
    /// </summary>
    public class CompletionScoreManager
    {
        /// <summary>
        /// Get the completion scores associated with a measure from the database
        /// </summary>
        public List<Completion_Score> GetCompletionScoresByOrganisation(string organisationName)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                return (from completionScores in context.Completion_Scores
                        where completionScores.Organisation_Name == organisationName
                        select completionScores).ToList();
            }
        }

        /// <summary>
        /// Get the completion scores associated with a perspective from the database
        /// </summary>
        public List<CompletionScoreViewModel> GetCompletionScoresByPerspective(PerspectiveViewModel pvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                List<Completion_Score> scores = (from completionScores in context.Completion_Scores
                        where completionScores.Perspective_Name == pvm.OldReference
                        && completionScores.Organisation_Name == pvm.OrganisationName
                        select completionScores).ToList();

                List<CompletionScoreViewModel> csvm = new List<CompletionScoreViewModel>();

                foreach (Completion_Score score in scores)
                {
                    csvm.Add(ExtractViewModel(score));
                }

                return csvm;
            }
        }

        /// <summary>
        /// Get the completion scores associated with a goal from the database
        /// </summary>
        public List<CompletionScoreViewModel> GetCompletionScoresByGoal(GoalViewModel gvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                List<Completion_Score> scores = (from completionScores in context.Completion_Scores
                        where completionScores.Perspective_Name == gvm.ParentName
                        && completionScores.Goal_Name == gvm.OldReference
                        && completionScores.Organisation_Name == gvm.OrganisationName
                        select completionScores).ToList();

                List<CompletionScoreViewModel> csvm = new List<CompletionScoreViewModel>();

                foreach (Completion_Score score in scores)
                {
                    csvm.Add(ExtractViewModel(score));
                }

                return csvm;
            }
        }

        /// <summary>
        /// Get the view models of completion scores associated with a measure from the database
        /// </summary>
        public List<CompletionScoreViewModel> GetCompletionScoresByMeasure(MeasureViewModel mvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                List<Completion_Score> scores = (from completionScores in context.Completion_Scores
                        where completionScores.Perspective_Name == mvm.GrandparentName
                        && completionScores.Goal_Name == mvm.ParentName
                        && completionScores.Measure_Name == mvm.OldReference
                        && completionScores.Organisation_Name == mvm.OrganisationName
                        select completionScores).ToList();

                List<CompletionScoreViewModel> csvm = new List<CompletionScoreViewModel>();

                foreach (Completion_Score score in scores)
                {
                    csvm.Add(ExtractViewModel(score));
                }

                return csvm;
            }
        }

        /// <summary>
        /// Add a completion score to the Database
        /// </summary>
        public void AddCompletionScore(CompletionScoreViewModel csvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (!CompletionScoreExists(context, csvm))
                {
                    Completion_Score newScore = new Completion_Score();

                    newScore.Completion_Score_Time = csvm.CompletionScoreTime;
                    newScore.Current_Value = csvm.CurrentValue;
                    newScore.Measure_Name = csvm.ParentName;
                    newScore.Goal_Name = csvm.GrandparentName;
                    newScore.Perspective_Name = csvm.GreatGrandparentName;
                    newScore.Organisation_Name = csvm.OrganisationName;

                    context.Completion_Scores.Add(newScore);
                    context.SaveChanges();
                }
            }
        }

        /// <summary>
        /// Delete a given completion score from the database.
        /// </summary>
        public void DeleteCompletionScore(CompletionScoreViewModel csvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (CompletionScoreExists(context, csvm))
                {
                    Completion_Score deleteScore = (from completionScore in context.Completion_Scores
                                                    where completionScore.Completion_Score_Time == csvm.CompletionScoreTime
                                                    && completionScore.Organisation_Name == csvm.OrganisationName
                                                    select completionScore).First();

                    context.Completion_Scores.Remove(deleteScore);
                    context.SaveChanges();
                }
            }
        }

        // Extract a view model from a database completion score.
        private CompletionScoreViewModel ExtractViewModel(Completion_Score cs)
        {
            CompletionScoreViewModel csvm = new CompletionScoreViewModel();

            csvm.CompletionScoreTime = cs.Completion_Score_Time;
            csvm.CurrentValue = cs.Current_Value;
            csvm.GrandparentName = cs.Goal_Name;
            csvm.GreatGrandparentName = cs.Perspective_Name;
            csvm.ParentName = cs.Measure_Name;
            csvm.OrganisationName = cs.Organisation_Name;

            return csvm;
        }

        // return whether or not a completion score exists in the database
        private bool CompletionScoreExists(Plan4GreenDB context, CompletionScoreViewModel csvm)
        {
            return (from completionScore in context.Completion_Scores
                    where completionScore.Completion_Score_Time == csvm.CompletionScoreTime
                    && completionScore.Organisation_Name == csvm.OrganisationName
                    select completionScore).Any();
        }
    }
}