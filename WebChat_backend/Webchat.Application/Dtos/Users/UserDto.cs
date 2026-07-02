using System;
using System.Collections.Generic;
using System.Text;

namespace Webchat.Application.Dtos.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public bool IsOnline { get; set; }
        public string Role { get; set; } = default!;
    }
}
