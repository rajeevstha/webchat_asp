using System;
using System.Collections.Generic;
using System.Text;

namespace Webchat.Application.Dtos.Users
{
    public class CreateUserRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
