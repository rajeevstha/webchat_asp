using System;
using System.Collections.Generic;
using System.Text;

namespace Webchat.Application.Dtos.Users
{
    public class UpdateUserRequest
    {
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Role { get; set; } = default!;
    }
}
