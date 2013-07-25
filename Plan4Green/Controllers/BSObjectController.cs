using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Plan4Green.Controllers
{
    public class BSObjectController : Controller
    {
        //
        // GET: /BSObject/

        public ActionResult PerspectiveViewer()
        {
            return View();
        }

        public ActionResult GoalViewer()
        {
            return View();
        }

        public ActionResult MeasureViewer()
        {
            return View();
        }
    }
}
