using Plan4Green.Models.ObjectManager;
using Plan4Green.Models.DB;
using Plan4Green.Models.ViewModels;
using System.Collections.Generic;
using System.IO;
using System.Web.Hosting;
using System.Web.Mvc;
using WebMatrix.WebData;
using System.Web.Script.Serialization;

namespace Plan4Green.Controllers
{
    /// <summary>
    /// Takes care of all JSON operations for Plan4Green.
    /// </summary>
    [AllowAnonymous]
    public class JSONController : Controller
    {
        #region Misc Operations

        /// <summary>
        /// Get the current user's organisation from the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetUsername()
        {
            UserManager um = new UserManager();
            string userName = um.GetUsername(WebSecurity.CurrentUserId);

            return Json(userName);
        }

        /// <summary>
        /// Converts list of background images from the local serve to JSON.
        /// </summary>
        /// <remarks>Images URL: ~/Images/background-images</remarks>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetBackgroundImages()
        {
            // set the background directory
            string backgroundDirectory = HostingEnvironment.MapPath("~/Images/background-images");
            string[] imagePaths = null;
            
            // if the directory is actually there
            if (Directory.Exists(backgroundDirectory))
            {
                // set the paths to the background images
                imagePaths = Directory.GetFiles(backgroundDirectory);
            }

            // return the json list
            return Json(imagePaths);
        }

        /// <summary>
        /// Get the current user's organisation from the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetOrganisation()
        {
            UserManager um = new UserManager();
            string organisationName = um.GetUserOrganisation(WebSecurity.CurrentUserId);

            return Json(organisationName);
        }

        #endregion

        #region Perspective Operations

        /// <summary>
        /// Gets the current perspectives belonging to an organisation.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetPerspectives()
        {
            UserManager um = new UserManager();
            string organisationName = um.GetUserOrganisation(WebSecurity.CurrentUserId);

            PerspectiveManager pm = new PerspectiveManager();
            List<Perspective> perspectives = pm.GetPerspectivesByOrganisation(organisationName);

            var array = perspectives.ToArray();
            string perspectiveString = string.Empty;

            for (int i = 0; i < array.Length; i++)
            {
                perspectiveString += array[i].Perspective_Name + "^";
                perspectiveString += array[i].Description + "^";
                perspectiveString += array[i].Organisation_Name + "^";
                perspectiveString += array[i].X_Position + "^";
                perspectiveString += array[i].Y_Position + "|";
            }

            return Json(perspectiveString);
        }

        /// <summary>
        /// Add a perspective to the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult AddPerspective(PerspectiveViewModel pvm)
        {           
            PerspectiveManager pm = new PerspectiveManager();
            pm.AddPerspective(pvm);

            return Json(pvm);
        }

        /// <summary>
        /// Change a perspective in the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult UpdatePerspective(PerspectiveViewModel pvm)
        {
            PerspectiveManager pm = new PerspectiveManager();
            pm.UpdatePerspective(pvm);

            return Json(string.Format("Succesfullly Updated {0}", pvm.OldReference));
        }

        /// <summary>
        /// Delete a perspective from the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult DeletePerspective(PerspectiveViewModel pvm)
        {
            PerspectiveManager pm = new PerspectiveManager();
            pm.RemovePerspective(pvm);

            return Json(pvm);
        }

        #endregion

        #region Goal Operations

        /// <summary>
        /// Gets the current goals belonging to an organisation.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetGoals()
        {
            UserManager um = new UserManager();
            string organisationName = um.GetUserOrganisation(WebSecurity.CurrentUserId);

            GoalManager gm = new GoalManager();
            List<Goal> goals = gm.GetGoalsByOrganisation(organisationName);

            var array = goals.ToArray();
            string goalString = string.Empty;

            for (int i = 0; i < array.Length; i++)
            {
                goalString += array[i].Goal_Name + "^";
                goalString += array[i].Description + "^";
                goalString += array[i].Organisation_Name + "^";
                goalString += array[i].X_Position + "^";
                goalString += array[i].Y_Position + "^";
                goalString += array[i].Start_Date + "^";
                goalString += array[i].Due_Date + "^";
                goalString += array[i].Perspective_Name + "|";
            }

            return Json(goalString);
        }

        /// <summary>
        /// Add a goal to the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult AddGoal(GoalViewModel gvm)
        {
            GoalManager gm = new GoalManager();
            gm.AddGoal(gvm);

            return Json(gvm);
        }

        /// <summary>
        /// Change a goal in the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult UpdateGoal(GoalViewModel gvm)
        {
            GoalManager gm = new GoalManager();
            gm.UpdateGoal(gvm);

            return Json(gvm);
        }

        /// <summary>
        /// Delete a goal from the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult DeleteGoal(GoalViewModel gvm)
        {
            GoalManager gm = new GoalManager();
            gm.RemoveGoal(gvm);

            return Json(gvm);
        }

        #endregion

        #region Measure Operations

        /// <summary>
        /// Gets the current measures belonging to an organisation.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetMeasures()
        {
            UserManager um = new UserManager();
            string organisationName = um.GetUserOrganisation(WebSecurity.CurrentUserId);

            MeasureManager mm = new MeasureManager();
            List<Measure> measures = mm.GetMeasuresByOrganisation(organisationName);

            var array = measures.ToArray();
            string measureString = string.Empty;

            for (int i = 0; i < array.Length; i++)
            {
                measureString += array[i].Measure_Name + "^";
                measureString += array[i].Description + "^";
                measureString += array[i].Organisation_Name + "^";
                measureString += array[i].X_Position + "^";
                measureString += array[i].Y_Position + "^";
                measureString += array[i].Start_Date + "^";
                measureString += array[i].Due_Date + "^";
                measureString += array[i].Perspective_Name + "^";
                measureString += array[i].Target_Value + "^";
                measureString += array[i].Goal_Name + "|";
            }

            return Json(measureString);
        }

        /// <summary>
        /// Add a measure to the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult AddMeasure(MeasureViewModel mvm)
        {
            MeasureManager mm = new MeasureManager();
            mm.AddMeasure(mvm);

            return Json(mvm);
        }

        /// <summary>
        /// Change a measure in the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult UpdateMeasure(MeasureViewModel mvm)
        {
            MeasureManager mm = new MeasureManager();
            mm.UpdateMeasure(mvm);

            return Json(mvm);
        }

        /// <summary>
        /// Change a measure in the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult DeleteMeasure(MeasureViewModel mvm)
        {
            MeasureManager mm = new MeasureManager();
            mm.RemoveMeasure(mvm);

            return Json(mvm);
        }

        #endregion

        #region Completion_Score Operations

        /// <summary>
        /// Gets the completion scores belonging to a measure.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetCompletionScores()
        {
            UserManager um = new UserManager();
            string organisationName = um.GetUserOrganisation(WebSecurity.CurrentUserId);

            CompletionScoreManager csm = new CompletionScoreManager();
            List<Completion_Score> completionScores = csm.GetCompletionScoresByOrganisation(organisationName);

            var array = completionScores.ToArray();
            string completionString = string.Empty;

            for (int i = 0; i < array.Length; i++)
            {
                completionString += array[i].Completion_Score_Time + "^";
                completionString += array[i].Current_Value + "^";
                completionString += array[i].Measure_Name + "^";
                completionString += array[i].Goal_Name + "^";
                completionString += array[i].Perspective_Name + "|";
            }

            return Json(completionString);
        }

        /// <summary>
        /// Add a completion score to the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult AddCompletionScore(CompletionScoreViewModel csvm)
        {
            CompletionScoreManager csm = new CompletionScoreManager();
            csm.AddCompletionScore(csvm);

            return Json(csvm);
        }

        #endregion
    }
}
