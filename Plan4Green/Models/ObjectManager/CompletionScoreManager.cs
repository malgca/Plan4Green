using Plan4Green.Models.DB;
using Plan4Green.Models.ViewModels;

namespace Plan4Green.Models.ObjectManager
{
    /// <summary>
    /// Manages Completion Score operations on the Database.
    /// </summary>
    public class CompletionScoreManager
    {
        /// <summary>
        /// Add an organisation to the Database
        /// </summary>
        /// <param name="organisation">The name of the Organisation to be added.</param>
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