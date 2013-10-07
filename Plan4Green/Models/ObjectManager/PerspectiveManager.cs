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
        /// Get's the perspectives associated with an Organisation from a database.
        /// </summary>
        /// <param name="organisationName"></param>
        public List<Perspective> GetPerspectivesByOrganisation(string organisationName)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                return (
                    from perspectives in context.Perspectives
                    where perspectives.Organisation_Name == organisationName
                    select perspectives).ToList();
            }
        }

        /// <summary>
        /// Add an organisation to the Database
        /// </summary>
        /// <param name="organisation">The name of the Organisation to be added.</param>
        public void AddPerspective(PerspectiveViewModel pvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (!PerspectiveExists(context, pvm))
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
                if(PerspectiveExists(context, pvm))
                {
                    // find what's changed and change it
                    Perspective workingPers = (from perspective in context.Perspectives
                                               where perspective.Perspective_Name == pvm.PerspectiveName
                                               && perspective.Organisation_Name == pvm.OrganisationName
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
                // case exists purely for changing names
                else
                {
                    // get a list of items with the old reference.
                    Perspective workingPerspective = (from perspective in context.Perspectives
                                                      where perspective.Perspective_Name == pvm.OldReference
                                                      select perspective).FirstOrDefault();

                    if (workingPerspective != default(Perspective))
                    {
                        UpdateName(pvm, workingPerspective);
                    }
                    return;
                }
            }
        }

        // update a perspectives name.
        private void UpdateName(PerspectiveViewModel pvm, Perspective workingPerspective)
        {
            //TODO: Fix this method
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                GoalManager gm = new GoalManager();
                MeasureManager mm = new MeasureManager();
                CompletionScoreManager csm = new CompletionScoreManager();

                List<GoalViewModel> gvms = gm.GetGoalsByPerspective(pvm);

                List<MeasureViewModel> mvms = new List<MeasureViewModel>();

                foreach (GoalViewModel gvm in gvms)
                {
                    List<MeasureViewModel> measures = mm.GetMeasuresByGoal(gvm);

                    foreach (MeasureViewModel measure in measures)
                    {
                        mvms.Add(measure);
                        mm.DeleteMeasure(measure);
                    }

                    gm.DeleteGoal(gvm);                    
                }

                context.Perspectives.Remove(workingPerspective);
                AddPerspective(pvm);

                foreach (GoalViewModel gvm in gvms)
                {
                    gvm.ParentName = pvm.PerspectiveName;
                    gm.AddGoal(gvm);
                }

                foreach (MeasureViewModel mvm in mvms)
                {
                    mvm.GrandparentName = pvm.PerspectiveName;
                    mm.AddMeasure(mvm);
                }

                context.SaveChanges();
            }
        }

        // Check if a Perspective already exists in the database.
        private bool PerspectiveExists(Plan4GreenDB context, PerspectiveViewModel pvm)
        {
            return (
                from perspective in context.Perspectives
                where perspective.Perspective_Name == pvm.PerspectiveName
                && perspective.Organisation_Name == pvm.OrganisationName
                select perspective).Any();
        }
    }
}