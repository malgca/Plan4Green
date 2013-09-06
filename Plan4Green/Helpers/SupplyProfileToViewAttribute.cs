using Plan4Green.Models.DB;
using System.Linq;
using System.Web.Mvc;

namespace Plan4Green.Helpers
{
    /// <summary>
    /// Populates ViewBag.UserProfile to match the authenticated user.
    /// </summary>
    public class SupplyProfileToViewAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // Only proceed if a user is authenticated
            if (!filterContext.RequestContext.HttpContext.User.Identity.IsAuthenticated)
            {
                return;
            }
            // Only proceed if rendering a view
            if (!(filterContext.Result is ViewResult))
            {
                return;
            }

            var db = new Plan4GreenDB();
            var userProfile = db.Users.SingleOrDefault(p => p.User_ID.ToString() == filterContext.HttpContext.User.Identity.Name);
            ((ViewResult)filterContext.Result).ViewBag.UserProfile = userProfile;
        }
    }
}