using System.Linq;
using Plan4Green.Models.DB;

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
                Organisation newOrg = new Organisation();

                if (!OrganisationExists(context, organisationName))
                {
                    newOrg.Organisation_Name = organisationName;
                }

                context.Organisations.Add(newOrg);
                context.SaveChanges();
            }
        }

        private bool OrganisationExists(Plan4GreenDB context, string organisationName)
        {
            return (
                from organisation in context.Organisations
                where organisation.Organisation_Name == organisationName
                select organisation).Any();
        }
    }
}
