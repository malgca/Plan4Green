using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Plan4Green.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Signup()
        {
            ViewBag.Title = "Signup";

            return View();
        }
    }
}
