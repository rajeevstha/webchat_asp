using System;
using System.Collections.Generic;
using System.Text;

namespace Webchat.Application.Dtos.Auth
{
    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = default!;
        public string NewPassword { get; set; } = default!;
    }
}
