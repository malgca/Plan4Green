using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Hosting;
using System.IO;
using Plan4Green.Filters;
using Plan4Green.Models;

namespace Plan4Green.Controllers
{
    /// <summary>
    /// Takes care of all JSON operations for Plan4Green.
    /// </summary>
    public class JSONController : Controller
    {
        //
        // GET: /JSON/

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

    }
}
