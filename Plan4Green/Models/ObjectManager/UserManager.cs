using Plan4Green.Models.DB;
using System.Linq;

namespace Plan4Green.Models.ObjectManager
{
    /// <summary>
    /// Manages User operations on the Database.
    /// </summary>
    /// <remarks>Login and Signup are handled by WebSecurity in the LoginController.</remarks>
    public class UserManager
    {
        /// <summary>
        /// Delete a specific user from the database.
        /// </summary>
        /// <param name="oldUser">The user to be deleted</param>
        public void DeleteUser(OrganisationalUser oldUser)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (!UserExists(context, oldUser.User_ID))
                {
                    return;
                }

                context.Users.Remove(oldUser);
                context.SaveChanges();
            }
        }

        /// <summary>
        /// Get the information of the organisation a user belongs to.
        /// </summary>
        /// <param name="user">The user who's organisation information will be retrieved.</param>
        public string GetUserOrganisation(int userID)
        {
            using (Plan4GreenDB context = new Plan4GreenDB())
            {
                if (UserExists(context, userID))
                {
                    OrganisationalUser orgUser = context.Users.First(currentUser => currentUser.User_ID == userID);
                    return orgUser.Organisation_Name;
                }

                return string.Empty;
            }
        }

        // Check if a User already exists in the database.
        private bool UserExists(Plan4GreenDB context, int userID)
        {
            return (
               from user in context.Users
               where user.User_ID == userID
               select user).Any();
        }

    }
}