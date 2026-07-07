using System;
using System.Collections.Generic;
using System.Text;

namespace Webchat.Application.Dtos.Admin
{
    public class CreateUserRequestAdmin
    {
        public string Name { get; set; } = default!;

        public string Email { get; set; } = default!;

        public string Password { get; set; } = default!;
    }
}
