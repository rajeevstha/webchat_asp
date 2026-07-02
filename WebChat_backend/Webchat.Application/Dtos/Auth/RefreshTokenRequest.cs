using System;
using System.Collections.Generic;
using System.Text;

namespace Webchat.Application.Dtos.Auth
{
    public sealed class RefreshTokenRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}
