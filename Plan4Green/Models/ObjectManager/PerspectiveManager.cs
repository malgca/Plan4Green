using Plan4Green.Models.DB;
using System.Collections.Generic;
using System.Linq;

namespace Plan4Green.Models.ObjectManager
{
    /// <summary>
    /// Manages Perspective operations on the Database.
    /// </summary>
    public class PerspectiveManager
    {
        /// <summary>
        /// Add an organisation to the Database
        /// </summary>
        /// <param name="organisation">The name of the Organisation to be added.</param>
        public void AddPerspective(Perspective newPerspective)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                Perspective workingPerspective = new Perspective();

                if (!PerspectiveExists(context, newPerspective.Perspective_Name))
                {
                    workingPerspective = newPerspective;
                }

                context.Perspectives.Add(workingPerspective);
                context.SaveChanges();
            }
        }

        /// <summary>
        /// Updates information on a Perspective in the Database.
        /// </summary>
        /// <param name="Perspective">The Perspective to be updated in the Database.</param>
        public void UpdatePerspective(Perspective Perspective)
        {
        }

        /// <summary>
        /// Deletes a Perspective from the Database.
        /// </summary>
        /// <param name="Perspective">The Perspective to be deleted from the Database.</param>
        public void DeletePerspective(Perspective Perspective)
        {
        }

        /// <summary>
        /// Get's the perspectives associated with an Organisation from a database.
        /// </summary>
        /// <param name="organisationName"></param>
        public List<Perspective> GetPerspectives(string organisationName)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                return (
                    from perspectives in context.Perspectives
                    where perspectives.Organisation_Name == organisationName
                    select perspectives).ToList();
            }
        }

        // Check if a Perspective already exists in the database.
        private bool PerspectiveExists(Plan4GreenDB context, string perspectiveName)
        {
            return (
                from perspective in context.Perspectives
                where perspective.Perspective_Name == perspectiveName
                select perspective).Any();
        }
    }
}