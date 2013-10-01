﻿using Plan4Green.Models.DB;
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
        public void AddPerspective(Perspective newPerspective)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (!PerspectiveExists(context, newPerspective.Perspective_Name))
                {
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
                // should search by old reference here!
                if (PerspectiveExists(context, pvm.PerspectiveName))
                {
                    // find what's changed and change it
                    Perspective workingPers = (from perspective in context.Perspectives
                                               where perspective.Perspective_Name == pvm.PerspectiveName
                                               select perspective).First();

                    workingPers.Perspective_Name = pvm.PerspectiveName;
                    //if (workingPers.Perspective_Name != pvm.OldReference)
                    //{
                    //    workingPers.Perspective_Name = pvm.PerspectiveName;
                    //}
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