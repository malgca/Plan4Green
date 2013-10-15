using Plan4Green.Models.DB;
using System.Linq;

namespace Plan4Green.Models.ObjectManager
{
    public class OrganisationManager
    {
        /// <summary>
        /// Add an organisation to the database
        /// </summary>
        /// <param name="organisation">The name of the organisation to be added.</param>
        public void AddOrganisation(string organisationName)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (!OrganisationExists(context, organisationName))
                {
                    Organisation newOrg = new Organisation();
                    newOrg.Organisation_Name = organisationName;
                    context.Organisations.Add(newOrg);
                    context.SaveChanges();
                }
            }
        }

        // find if the organisation in question actually exists
        private bool OrganisationExists(Plan4GreenDB context, string organisationName)
        {
            return (
                from organisation in context.Organisations
                where organisation.Organisation_Name == organisationName
                select organisation).Any();
        }
    }
}
