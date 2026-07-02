ChatSolution

│

├── Chat.API

│   │

│   ├── Endpoints

│   │   ├── AuthEndpoints.cs

│   │   ├── UserEndpoints.cs

│   │   ├── ConversationEndpoints.cs

│   │   └── MessageEndpoints.cs

│   │

│   ├── Extensions

│   │   ├── ServiceCollectionExtensions.cs

│   │   └── EndpointExtensions.cs

│   │

│   ├── appsettings.json

│   ├── Program.cs

│   └── Chat.API.csproj

│

│

├── Chat.Domain

│   │

│   ├── Entities

│   │   ├── User.cs

│   │   ├── Conversation.cs

│   │   ├── ConversationParticipant.cs

│   │   └── Message.cs

│   │

│   ├── Enums

│   │   └── UserRole.cs

│   │

│   └── Chat.Domain.csproj

│

│

├── Chat.Application

│   │

│   ├── DTOs

│   │   │

│   │   ├── Auth

│   │   │   ├── RegisterRequest.cs

│   │   │   ├── LoginRequest.cs

│   │   │   └── LoginResponse.cs

│   │   │

│   │   ├── Users

│   │   │   ├── CreateUserRequest.cs

│   │   │   └── UpdateUserRequest.cs

│   │   │

│   │   ├── Conversations

│   │   │   └── CreateConversationRequest.cs

│   │   │

│   │   └── Messages

│   │       ├── SendMessageRequest.cs

│   │       └── MarkSeenRequest.cs

│   │

│   ├── Interfaces

│   │   ├── IUserService.cs

│   │   ├── IAuthService.cs

│   │   ├── IConversationService.cs

│   │   └── IMessageService.cs

│   │

│   ├── Validators

│   │   ├── RegisterRequestValidator.cs

│   │   ├── LoginRequestValidator.cs

│   │   ├── CreateConversationValidator.cs

│   │   └── SendMessageValidator.cs

│   │

│   └── Chat.Application.csproj

│

│

├── Chat.Infrastructure

│   │

│   ├── Data

│   │   ├── ChatDbContext.cs

│   │   └── Configurations

│   │       ├── UserConfiguration.cs

│   │       ├── ConversationConfiguration.cs

│   │       ├── MessageConfiguration.cs

│   │       └── ConversationParticipantConfiguration.cs

│   │

│   ├── Services

│   │   ├── AuthService.cs

│   │   ├── UserService.cs

│   │   ├── ConversationService.cs

│   │   └── MessageService.cs

│   │

│   ├── SignalR

│   │   └── ChatHub.cs

│   │

│   ├── Authentication

│   │   └── JwtTokenGenerator.cs

│   │

│   ├── Migrations

│   │

│   └── Chat.Infrastructure.csproj

│

│

└── ChatSolution.sln

