using Plan4Green.Models.DB;
using System.Linq;

namespace Plan4Green.Models.ObjectManager
{
    /// <summary>
    /// Manages Goal operations on the Database.
    /// </summary>
    public class GoalManager
    {
        /// <summary>
        /// Add an organisation to the Database
        /// </summary>
        /// <param name="organisation">The name of the Organisation to be added.</param>
        public void AddGoal(Goal newGoal)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                Goal workingGoal = new Goal();

                if (!GoalExists(context, newGoal.Goal_Name, newGoal.Perspective_Name))
                {
                    workingGoal = newGoal;
                }

                context.Goals.Add(workingGoal);
                context.SaveChanges();
            }
        }

        /// <summary>
        /// Updates information on a Goal in the Database.
        /// </summary>
        /// <param name="Goal">The Goal to be updated in the Database.</param>
        public void UpdateGoal(Goal Goal)
        {
        }

        /// <summary>
        /// Deletes a Goal from the Database.
        /// </summary>
        /// <param name="Goal">The Goal to be deleted from the Database.</param>
        public void DeleteGoal(Goal Goal)
        {
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