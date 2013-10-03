using Plan4Green.Models.DB;
using Plan4Green.Models.ViewModels;
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
        public void AddPerspective(PerspectiveViewModel pvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (!PerspectiveExists(context, pvm.PerspectiveName))
                {
                    Perspective newPerspective = new Perspective();

                    newPerspective.Perspective_Name = pvm.PerspectiveName;
                    newPerspective.Description = pvm.Description;
                    newPerspective.Organisation_Name = pvm.OrganisationName;
                    newPerspective.X_Position = pvm.xPosition;
                    newPerspective.Y_Position = pvm.yPosition;

                    context.Perspectives.Add(newPerspective);
                    context.SaveChanges();
                }
            }
        }

        /// <summary>
        /// Updates information on a Perspective in the Database.
        /// </summary>
        /// <param name="Perspective">The ViewModel containing the Perspective to be updated in the Database.</param>
        public void UpdatePerspective(PerspectiveViewModel pvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                // case exists purely for changing names
                if (PerspectiveExists(context, pvm.OldReference))
                {
                    // get a list of items with the old reference.
                    List<Perspective> perspectives = (from perspective in context.Perspectives
                                                      where perspective.Perspective_Name == pvm.OldReference
                                                      select perspective).ToList();

                    for (int i = 0; i < perspectives.Count; i++)
                    {
                        if (perspectives[i].Perspective_Name == pvm.PerspectiveName)
                        {
                            continue;
                        }
                        else
                        {
                            if (pvm.NameHasChanged)
                            {
                                context.Perspectives.Remove(perspectives[i]);
                                AddPerspective(pvm);
                                context.SaveChanges();
                                return;
                            }
                        }
                    }
                }
                if(PerspectiveExists(context, pvm.PerspectiveName))
                {
                    // find what's changed and change it
                    Perspective workingPers = (from perspective in context.Perspectives
                                               where perspective.Perspective_Name == pvm.PerspectiveName
                                               select perspective).First();

                    if (workingPers.Description != pvm.Description)
                    {
                        workingPers.Description = pvm.Description;
                    }
                    if (workingPers.X_Position != pvm.xPosition)
                    {
                        workingPers.X_Position = pvm.xPosition;
                    }
                    if (workingPers.Y_Position != pvm.yPosition)
                    {
                        workingPers.Y_Position = pvm.yPosition;
                    }

                    context.SaveChanges();
                    return;
                }
            }
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

        // update a perspectives name.
        private void UpdateName(PerspectiveViewModel pvm)
        {
            // get all perspective measures.
            // get all perspective goals.

            // remove all perspective measures.
            // remove all perspective goals.

            // add all perspective measures using new name as parents (may need to create new measure).
            // add all perspective goal using new name as parents (may need to create new goal).

            // remove the perspective
            // add under new name
            // save changes to context
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