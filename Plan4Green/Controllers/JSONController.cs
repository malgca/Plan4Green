using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Hosting;
using System.IO;
using Plan4Green.Filters;
using Plan4Green.Models.DB;
using Plan4Green.Models.ObjectManager;
using Plan4Green.Models.ViewModels;
using WebMatrix.WebData;

namespace Plan4Green.Controllers
{
    /// <summary>
    /// Takes care of all JSON operations for Plan4Green.
    /// </summary>
    [AllowAnonymous]
    public class JSONController : Controller
    {
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
        /// Given a User ID, get that user's organisation from the database pertaining to that users organisation.
        /// </summary>
        /// <param name="userID">The user ID to search on.</param>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetOrganisation()
        {
            UserManager userMan = new UserManager();
            string organisationalInfo = userMan.GetUserOrganisation(WebSecurity.CurrentUserId);
            return Json(organisationalInfo);
        }
    }
}
