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

        /// <summary>
        /// Returns the view for the HTML5 canvas element.
        /// </summary>
        public ActionResult CanvasView()
        {
            return View();
        }

        /// <summary>
        /// Draws existing Perspectives from Database. If no Perspectives exist: Financial, .Customer, Internal Process and Learning and Growth Perspectives drawn.
        /// </summary>
        public ActionResult DrawDBPerspectives()
        {
            return JavaScript("draw perspectives from DB");
        }

        /// <summary>
        /// Draws existing Goals from Database. If no Goals exist, generic empty Goal drawn.
        /// </summary>
        public ActionResult DrawDBGoals()
        {
            return JavaScript("draw goals from DB");
        }

        /// <summary>
        /// Draws existing Measures from Database. If no Measures exist, generic empty Measure drawn.
        /// </summary>
        public ActionResult DrawDBMeasures()
        {
            return JavaScript("draw measures from DB");
        }
    }
}
