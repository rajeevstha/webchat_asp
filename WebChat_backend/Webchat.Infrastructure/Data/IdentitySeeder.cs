using Webchat.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Webchat.Infrastructure.Data
{
    public static class IdentitySeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            var userManager = services.GetRequiredService<UserManager<User>>();

            // Create roles
            string[] roles =
            {
            "Admin",
            "User"
        };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(
                        new IdentityRole<Guid>(role));
                }
            }

            // Create admin
            const string email = "admin@webchat.com";
            const string password = "Admin123!";

            var admin = await userManager.FindByEmailAsync(email);

            if (admin == null)
            {
                admin = new User
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(
                    admin,
                    password);

                if (!result.Succeeded)
                {
                    throw new Exception(
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }
    }
}
