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
        public List<Completion_Score> GetCompletionScores()
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                return (from completionScores in context.Completion_Scores
                        select completionScores).ToList();
            }
        }

        /// <summary>
        /// Add a completion score to the Database
        /// </summary>
        public void AddCompletionScore(CompletionScoreViewModel csvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                Completion_Score newScore = new Completion_Score();

                newScore.Completion_Score_Time = csvm.CompletionScoreTime;
                newScore.Current_Value = csvm.CurrentValue;
                newScore.Measure_Name = csvm.ParentName;
                newScore.Goal_Name = csvm.GrandparentName;               

                context.Completion_Scores.Add(newScore);
                context.SaveChanges();
            }
        }
    }
}