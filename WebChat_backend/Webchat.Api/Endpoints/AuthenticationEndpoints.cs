using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Webchat.Application.Dtos.Auth;
using Webchat.Application.Dtos.Users;
using Webchat.Application.Interfaces;
using Webchat.Domain.Entities;

namespace Webchat.Api.Endpoints;

public static class AuthenticationEndpoints
{
    public static void MapAuthenticationEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth");

        // REGISTER
        group.MapPost("/register",
            async (
                [FromServices] IAuthService authService,
                [FromBody] CreateUserRequest request) =>
            {
                var user = await authService.CreateUserAsync(
                    request.Email,
                    request.Password);

                return Results.Ok(new
                {
                    user.Id,
                    user.Email,
                    user.CreatedAt
                });
            });

        // LOGIN
        group.MapPost("/login",
    static async (
        HttpContext httpContext,
        [FromServices] IAuthService authService,
        [FromBody] LoginRequest request) =>
    {
        var response = await authService.LoginAsync(
            request.Email,
            request.Password);

        httpContext.Response.Cookies.Append(
            "refreshToken",
            response.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // true when using HTTPS
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(30)
            });

        // Don't send the refresh token in the response body
        response.RefreshToken = string.Empty;

        return Results.Ok(new
        {
            accessToken = response.AccessToken
        });
    });

        //LOGOUT
        group.MapPost("/logout",
            async ([FromServices] IAuthService authService) =>
            {
                await authService.LogoutAsync();
                return Results.Ok("Logged out successfully.");
            });

        //REFRESH
        group.MapPost("/refresh",
        static async (
            HttpContext httpContext,
            [FromServices] IAuthService authService) =>
            {
                var refreshToken = httpContext.Request.Cookies["refreshToken"];

                if (string.IsNullOrWhiteSpace(refreshToken))
                    return Results.Unauthorized();

                var response = await authService.RefreshTokenAsync(refreshToken);

                return Results.Ok(response);
            });


        //ME
        group.MapGet("/me", async (
        ClaimsPrincipal principal,
        UserManager<User> userManager) =>
            {
                var user = await userManager.GetUserAsync(principal);

                if (user is null)
                    return Results.Unauthorized();

                var roles = await userManager.GetRolesAsync(user);


                return Results.Ok(new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    Roles = roles
                });
            })
            .RequireAuthorization();

    }
}