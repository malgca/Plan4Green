using System.Web.Mvc;

namespace Plan4Green
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            //filters.Add(new AuthorizeAttribute());
            filters.Add(new HandleErrorAttribute());
        }
    }
}