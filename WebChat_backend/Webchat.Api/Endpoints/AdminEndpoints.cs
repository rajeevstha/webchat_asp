using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Webchat.Application.Dtos.Admin;
using Webchat.Application.Dtos.Users;
using Webchat.Application.Interfaces;

namespace Webchat.Api.Endpoints;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    // GET: api/admin/users
    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }

    // GET: api/admin/users/{id}
    [HttpGet("users/{id:guid}")]
    public async Task<ActionResult<UserDto>> GetUser(Guid id)
    {
        var user = await _adminService.GetUserByIdAsync(id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // POST: api/admin/users
    [HttpPost("users")]
    public async Task<ActionResult<UserDto>> CreateUser(
        CreateUserRequestAdmin request)
    {
        var user = await _adminService.CreateUserAsync(request);

        return CreatedAtAction(
            nameof(GetUser),
            new { id = user.Id },
            user);
    }

    // PUT: api/admin/users/{id}
    [HttpPut("users/{id:guid}")]
    public async Task<ActionResult<UserDto>> UpdateUser(
        Guid id,
        UpdateUserRequest request)
    {
        var user = await _adminService.UpdateUserAsync(id, request);

        return Ok(user);
    }

    // DELETE: api/admin/users/{id}
    [HttpDelete("users/{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        await _adminService.DeleteUserAsync(id);

        return NoContent();
    }

    // PUT: api/admin/users/{id}/block
    [HttpPut("users/{id:guid}/block")]
    public async Task<IActionResult> BlockUser(Guid id)
    {
        await _adminService.BlockUserAsync(id);

        return NoContent();
    }

    // PUT: api/admin/users/{id}/unblock
    [HttpPut("users/{id:guid}/unblock")]
    public async Task<IActionResult> UnblockUser(Guid id)
    {
        await _adminService.UnblockUserAsync(id);

        return NoContent();
    }
}