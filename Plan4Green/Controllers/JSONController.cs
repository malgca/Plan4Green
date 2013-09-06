﻿using Plan4Green.Models.ObjectManager;
using System.IO;
using System.Web.Hosting;
using System.Web.Mvc;
using WebMatrix.WebData;

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

        #endregion

        #region Organisation Operations

        /// <summary>
        /// Get the current user's organisation from the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetOrganisation()
        {
            UserManager userMan = new UserManager();
            string organisationalInfo = userMan.GetUserOrganisation(WebSecurity.CurrentUserId);
            return Json(organisationalInfo);
        }
        
        #endregion

        #region Perspective Operations

        /// <summary>
        /// Gets the current perspectives belonging to an organisation.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetPerspectives()
        {
            return Json("");
        }

        /// <summary>
        /// Add a perspective to the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult AddPerspective()
        {
            return Json("");
        }

        /// <summary>
        /// Delete a perspective from the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult DeletePerspective()
        {
            return Json("");
        }

        /// <summary>
        /// Change a perspective in the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult UpdatePerspective()
        {
            return Json("");
        }

        #endregion

        #region Goal Operations

        /// <summary>
        /// Add a perspective to the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult AddGoal()
        {
            return Json("");
        }

        /// <summary>
        /// Delete a perspective from the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult DeleteGoal()
        {
            return Json("");
        }

        /// <summary>
        /// Change a perspective in the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult UpdateGoal()
        {
            return Json("");
        }

        #endregion

        #region Measure Operations

        /// <summary>
        /// Add a perspective to the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult AddMeasure()
        {
            return Json("");
        }

        /// <summary>
        /// Delete a perspective from the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult DeleteMeasure()
        {
            return Json("");
        }

        /// <summary>
        /// Change a perspective in the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult UpdateMeasure()
        {
            return Json("");
        }

        #endregion

        #region Completion_Score Operations

        /// <summary>
        /// Add a perspective to the database.
        /// </summary>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult AddCompletionScore()
        {
            return Json("");
        }

        #endregion

    }
}