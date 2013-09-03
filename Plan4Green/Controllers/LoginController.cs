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
using Plan4Green.Models.DB;
using Plan4Green.Models.ViewModels;
using Plan4Green.Models.ObjectManager;

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
        [AllowAnonymous]
        public ActionResult Login()
        {
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
        public ActionResult Login(AuthenticationViewModel model, string returnUrl)
        {
            try
            {
                bool loggedIn = WebSecurity.Login(model.LoginModel.UserName, model.LoginModel.Password, persistCookie: model.LoginModel.RememberMe);
                if (ModelState.IsValid && loggedIn)
                {
                    ViewBag.UserMessage = string.Format("Hi, {0}", model.LoginModel.UserName);
                    return RedirectToAction("CanvasView", "BSObject");
                }

                // If we get this far, something failed and we should redisplay the form.
                ModelState.AddModelError("unknownLogonError", "Unable to log on. If this problem persists, please contact your system administrator.");
                return View(model);
            }
            catch (Exception exception)
            {
                ViewBag.Error = exception.Message;
                return RedirectToLocal(returnUrl);
            }
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
        /// <remarks>POST method</remarks>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Signup(AuthenticationViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Try to register the user.
                try
                {
                    OrganisationManager orgManager = new OrganisationManager();
                    orgManager.AddOrganisation(model.SignupModel.Organisation);
                    WebSecurity.CreateUserAndAccount(model.SignupModel.UserName, model.SignupModel.Password, new { UserPassword = model.SignupModel.Password, Organisation_ID = model.SignupModel.Organisation });

                    WebSecurity.Login(model.SignupModel.UserName, model.SignupModel.Password);
                    ViewBag.Message = string.Format("Hi, {0}", model.SignupModel.UserName);
                    
                    return RedirectToAction("CanvasView", "BSObject");
                }
                catch (MembershipCreateUserException exception)
                {
                    ModelState.AddModelError("", exception.Message);
                }
            }

            ModelState.AddModelError("unknownSignupError", "Unable to sign on. If this problem persists, please contact your system administrator.");
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
