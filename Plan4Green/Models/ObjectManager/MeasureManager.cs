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
        public List<Measure> GetMeasures(string organisationName)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                return (from measure in context.Measures
                        where measure.Organisation_Name == organisationName
                        select measure).ToList();
            }
        }

        /// <summary>
        /// Add an organisation to the Database
        /// </summary>
        public void AddMeasure(MeasureViewModel mvm)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (!MeasureExists(context, mvm.MeasureName, mvm.ParentName))
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
                // get a list of items with the old reference.
                List<Goal> measures = (from measure in context.Goals
                                    where measure.Goal_Name == mvm.OldReference
                                    select measure).ToList();

                for (int i = 0; i < measures.Count; i++)
                {
                    if (measures[i].Perspective_Name == mvm.MeasureName)
                    {
                        continue;
                    }
                    else
                    {
                        if (mvm.NameHasChanged)
                        {
                            context.Goals.Remove(measures[i]);
                            AddMeasure(mvm);
                            context.SaveChanges();
                            return;
                        }
                    }
                }
                if (MeasureExists(context, mvm.MeasureName, mvm.ParentName))
                {
                    Measure workingMeasure = (from measure in context.Measures
                                           where measure.Measure_Name == mvm.MeasureName
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
            }
        }

        // update a perspectives name.
        private void UpdateName(GoalViewModel gvm)
        {
            // remove the goal
            // add under new name
            // change the measure name in completion scores
            // save changes to context
        }

        // Check if a Measure already exists in the database.
        private bool MeasureExists(Plan4GreenDB context, string measureName, string goalName)
        {
            return (
                from measure in context.Measures
                where measure.Measure_Name.Equals(measureName)
                && measure.Goal_Name.Equals(goalName)
                select measure).Any();
        }
    }
}