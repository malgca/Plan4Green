using Plan4Green.Models.DB;
using Plan4Green.Models.ViewModels;
using System.Collections.Generic;
using System.Linq;

namespace Plan4Green.Models.ObjectManager
{
    /// <summary>
    /// Manages Measure operations on the Database.
    /// </summary>
    public class MeasureManager
    {
        /// <summary>
        /// Get's the measures associated with an Organisation from a database.
        /// </summary>
        public List<Measure> GetMeasuresByOrganisation(string organisationName)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                return (from measure in context.Measures
                        where measure.Organisation_Name == organisationName
                        select measure).ToList();
            }
        }

        /// <summary>
        /// Get the List of Measures belonging to a single Goal.
        /// </summary>
        public List<MeasureViewModel> GetMeasuresByGoal(GoalViewModel gvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                List<Measure> measures = (from measure in context.Measures
                                          where measure.Goal_Name == gvm.OldReference
                                          && measure.Perspective_Name == gvm.ParentName
                                          && measure.Organisation_Name == gvm.OrganisationName
                                          select measure).ToList();

                List<MeasureViewModel> mvms = new List<MeasureViewModel>();

                foreach (Measure measure in measures)
                {
                    mvms.Add(ExtractViewModel(measure));
                }

                return mvms;
            }
        }

        /// <summary>
        /// Add an organisation to the Database
        /// </summary>
        public void AddMeasure(MeasureViewModel mvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (!MeasureExists(context, mvm))
                {
                    Measure newMeasure = new Measure();

                    newMeasure.Measure_Name = mvm.MeasureName;
                    newMeasure.Description = mvm.Description;
                    newMeasure.Start_Date = mvm.StartDate;
                    newMeasure.Due_Date = mvm.DueDate;
                    newMeasure.X_Position = mvm.xPosition;
                    newMeasure.Y_Position = mvm.yPosition;
                    newMeasure.Target_Value = mvm.targetValue;
                    newMeasure.Goal_Name = mvm.ParentName;
                    newMeasure.Perspective_Name = mvm.GrandparentName;
                    newMeasure.Organisation_Name = mvm.OrganisationName;

                    context.Measures.Add(newMeasure);
                    context.SaveChanges();
                }
            }
        }

        /// <summary>
        /// Updates information on a Measure in the Database.
        /// </summary>
        public void UpdateMeasure(MeasureViewModel mvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (MeasureExists(context, mvm))
                {
                    Measure workingMeasure = (from measure in context.Measures
                                              where measure.Measure_Name == mvm.MeasureName
                                              && measure.Organisation_Name == mvm.OrganisationName
                                              select measure).First();

                    if (workingMeasure.Description != mvm.Description)
                    {
                        workingMeasure.Description = mvm.Description;
                    }
                    if (workingMeasure.X_Position != mvm.xPosition)
                    {
                        workingMeasure.X_Position = mvm.xPosition;
                    }
                    if (workingMeasure.Y_Position != mvm.yPosition)
                    {
                        workingMeasure.Y_Position = mvm.yPosition;
                    }
                    if (workingMeasure.Start_Date != mvm.StartDate)
                    {
                        workingMeasure.Start_Date = mvm.StartDate;
                    }
                    if (workingMeasure.Due_Date != mvm.DueDate)
                    {
                        workingMeasure.Due_Date = mvm.DueDate;
                    }
                    if (workingMeasure.Target_Value != mvm.targetValue)
                    {
                        workingMeasure.Target_Value = mvm.targetValue;
                    }
                    if (workingMeasure.Organisation_Name != mvm.OrganisationName)
                    {
                        workingMeasure.Organisation_Name = mvm.OrganisationName;
                    }

                    context.SaveChanges();
                    return;
                }
                else
                {
                    // get a list of items with the old reference.
                    Measure workingMeasure = (from measure in context.Measures
                                              where measure.Measure_Name == mvm.OldReference
                                              && measure.Goal_Name == mvm.ParentName
                                              && measure.Perspective_Name == mvm.GrandparentName
                                              && measure.Organisation_Name == mvm.OrganisationName
                                              select measure).FirstOrDefault();

                    if (workingMeasure != default(Measure))
                    {
                        UpdateName(mvm, workingMeasure);
                    }
                    return;
                }
            }
        }

        /// <summary>
        /// Deletes a measure from the Database
        /// </summary>
        public void DeleteMeasure(MeasureViewModel mvm, bool deleteByOldReference = false)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                Measure deleteMeasure;

                if (deleteByOldReference)
                {
                    deleteMeasure = (from measure in context.Measures
                                     where measure.Measure_Name == mvm.OldReference
                                     && measure.Goal_Name == mvm.ParentName
                                     && measure.Perspective_Name == mvm.GrandparentName
                                     && measure.Organisation_Name == mvm.OrganisationName
                                     select measure).FirstOrDefault();
                }
                else
                {
                    deleteMeasure = (from measure in context.Measures
                                     where measure.Measure_Name == mvm.MeasureName
                                     && measure.Goal_Name == mvm.ParentName
                                     && measure.Perspective_Name == mvm.GrandparentName
                                     && measure.Organisation_Name == mvm.OrganisationName
                                     select measure).FirstOrDefault();
                }

                if (deleteMeasure != default(Measure))
                {
                    context.Measures.Remove(deleteMeasure);
                    context.SaveChanges();
                }
            }
        }

        // Extracts the view model from a given measure in the Database
        private MeasureViewModel ExtractViewModel(Measure measure)
        {
            MeasureViewModel mvm = new MeasureViewModel();

            mvm.MeasureName = measure.Measure_Name;
            mvm.OrganisationName = measure.Organisation_Name;
            mvm.ParentName = measure.Goal_Name;
            mvm.GrandparentName = measure.Perspective_Name;
            mvm.StartDate = measure.Start_Date;
            mvm.DueDate = measure.Due_Date;
            mvm.Description = measure.Description;
            mvm.targetValue = measure.Target_Value;
            mvm.xPosition = measure.X_Position;
            mvm.yPosition = measure.Y_Position;

            return mvm;
        }

        // update a measures name.
        private void UpdateName(MeasureViewModel mvm, Measure workingMeasure)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                CompletionScoreManager csm = new CompletionScoreManager();
                List<CompletionScoreViewModel> csvms = csm.GetCompletionScoresByMeasure(mvm);

                foreach (CompletionScoreViewModel csvm in csvms)
                {
                    csm.DeleteCompletionScore(csvm);
                }

                DeleteMeasure(mvm, true);
                AddMeasure(mvm);

                foreach (CompletionScoreViewModel csvm in csvms)
                {
                    csvm.ParentName = mvm.MeasureName;
                    csm.AddCompletionScore(csvm);
                }
            }
        }

        // Check if a Measure already exists in the database.
        private bool MeasureExists(Plan4GreenDB context, MeasureViewModel mvm)
        {
            return (
                from measure in context.Measures
                where measure.Measure_Name == mvm.MeasureName
                && measure.Goal_Name == mvm.ParentName
                && measure.Perspective_Name == mvm.GrandparentName
                && measure.Organisation_Name == mvm.OrganisationName
                select measure).Any();
        }
    }
}