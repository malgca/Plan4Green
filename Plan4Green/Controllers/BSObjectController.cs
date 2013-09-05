using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebMatrix.WebData;

namespace Plan4Green.Controllers
{
    public class BSObjectController : Controller
    {
        //
        // GET: /BSObject/

        /// <summary>
        /// Returns the view for the HTML5 canvas element.
        /// </summary>
        public ActionResult CanvasView()
        {
            ViewBag.CurrentUserID = WebSecurity.CurrentUserId;
            return View();
        }
    }
}
