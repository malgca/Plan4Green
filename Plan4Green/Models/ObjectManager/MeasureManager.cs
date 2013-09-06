using Plan4Green.Models.DB;
using System.Linq;

namespace Plan4Green.Models.ObjectManager
{
    /// <summary>
    /// Manages Measure operations on the Database.
    /// </summary>
    public class MeasureManager
    {
        /// <summary>
        /// Add an organisation to the Database
        /// </summary>
        /// <param name="organisation">The name of the Organisation to be added.</param>
        public void AddMeasure(Measure newMeasure)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                Measure workingMeasure = new Measure();

                if (!MeasureExists(context, newMeasure.Measure_ID))
                {
                    workingMeasure = newMeasure;
                }

                context.Measures.Add(workingMeasure);
                context.SaveChanges();
            }
        }
        
        /// <summary>
        /// Updates information on a Measure in the Database.
        /// </summary>
        /// <param name="measure">The Measure to be updated in the Database.</param>
        public void UpdateMeasure(Measure measure)
        {
        }

        /// <summary>
        /// Deletes a Measure from the Database.
        /// </summary>
        /// <param name="measure">The Measure to be deleted from the Database.</param>
        public void DeleteMeasure(Measure measure)
        {
        }

        // Check if a Measure already exists in the database.
        private bool MeasureExists(Plan4GreenDB context, int measureID)
        {
            return (
                from measure in context.Measures
                where measure.Measure_ID == measureID
                select measure).Any();
        }
    }
}