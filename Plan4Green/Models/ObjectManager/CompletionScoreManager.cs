using Plan4Green.Models.DB;

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
        public void AddCompletionScore(Completion_Score newScore)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                Completion_Score workingScore = new Completion_Score();

                workingScore = newScore;

                context.Completion_Scores.Add(workingScore);
                context.SaveChanges();
            }
        }
    }
}