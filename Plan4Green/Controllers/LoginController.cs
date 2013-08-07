using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using WebMatrix.WebData;
using Plan4Green.Filters;
using Plan4Green.Models;

namespace Plan4Green.Controllers
{
    [Authorize]
    [InitializeSimpleMembership]
    public class LoginController : Controller
    {
        /// <summary>
        /// Log into the Plan4Green app using already established credentials.
        /// </summary>
        /// <remarks>GET method</remarks>
        /// <param name="returnUrl">Url to go to once login is successful.</param>
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }
        /// <summary>
        /// Log into the Plan4Green app using already established credentials.
        /// </summary>
        /// <remarks>POST method.</remarks>
        /// <param name="model">Data model used for the Plan4Green app.</param>
        /// <param name="returnUrl">Url to return to once login is successful.</param>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginModel model, string returnUrl)
        {
            if(ModelState.IsValid && WebSecurity.Login(model.UserName, model.Password, persistCookie: model.RememberMe))
            {
                return RedirectToLocal(returnUrl);
            }

            // If we get this far, something failed and we should redisplay the form.
            ModelState.AddModelError("","The user name or password you've entered is incorrect. Please try again.");
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOut()
        {
            WebSecurity.Logout();
            return RedirectToAction("Login", "Login");
        }

        /// <summary>
        /// Signup to use the Plan4Green app.
        /// </summary>
        /// <remarks>GET method</remarks>
        [AllowAnonymous]
        public ActionResult Signup()
        {
            return View();
        }

        /// <summary>
        /// Signup to use the Plan4Green app.
        /// </summary>
        /// <remarks>POST method</remarks>
        [HttpPost]
        [AllowAnonymous]
        public ActionResult Signup(SignupModel model)
        {
            if (ModelState.IsValid)
            {
                // Try to register the user.
                try
                {
                    WebSecurity.CreateUserAndAccount(model.UserName, model.Password, new { Organisation_ID = model.Organisation });
                    WebSecurity.Login(model.UserName, model.Password);
                    return RedirectToAction("CanvasView", "BSObject");
                }
                catch (MembershipCreateUserException exception)
                {
                    ModelState.AddModelError("", exception.Message);
                }
            }

            // Something's wrong, redisplay the form.
            return View(model);
        }

        #region Login Helpers

        /// <summary>
        /// Redirects to page within the app.
        /// </summary>
        /// <param name="localUrl">The local Url to return to.</param>
        private ActionResult RedirectToLocal(string localUrl)
        {
            if (Url.IsLocalUrl(localUrl))
            {
                return Redirect(localUrl);
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }
        }

        /// <summary>
        /// Message ID for managing user data.
        /// </summary>
        public enum ManageMessageID
        {
            ChangePasswordSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
        }

        /// <summary>
        /// Possible error codes when creating a user.
        /// </summary>
        /// <param name="createStatus">Status of the users creation attempt.</param>
        /// <returns>A friendly, string representation of the user creation problem.</returns>
        private static string ErrorCodeToString(MembershipCreateStatus createStatus)
        {
            switch (createStatus)
            {
                case MembershipCreateStatus.DuplicateUserName:
                    return "Sorry, that username is already taken. Please choose a different one.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "Sorry, that e-mail address is already taken. Please choose a different one.";

                case MembershipCreateStatus.InvalidPassword:
                    return "Sorry, that password is invalid. Please enter a valid one.";

                case MembershipCreateStatus.InvalidUserName:
                    return "Sorry, that username is invalid. Please enter a different one.";

                case MembershipCreateStatus.UserRejected:
                    return "Sorry, your creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                default:
                    return "An unknown error occured. If this problem persists, please contact your system administrator.";
            }
        }

        #endregion
    }
}
