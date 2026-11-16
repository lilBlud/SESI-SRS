using System.Collections.Generic;
using System.Threading.Tasks;
using mobile_backend.DTOs;
using mobile_backend.Models;

namespace mobile_backend.Services
{
    public interface IUserService
    {
        Task<StreakDto> GetUserStreakAsync(string username);
        Task<ReadActivityDto> RecordActivityAsync(string username);
        Task<List<UserProfileDto>> GetAllUsersAsync();
        Task<UserProfileDto?> GetUserProfileAsync(string username);
        Task<bool> UpdatePreferredNameAsync(string username, string preferredName);
        Task<bool> UpdateProfilePictureAsync(string username, string profilePicture);
        Task<bool> UpdateUserRoleAsync(int id, string role);
        Task<bool> DeleteUserAsync(int id);
        Task<AuthResponseDto?> LoginAsync(string email, string password);
        Task<AuthResponseDto?> SignupAsync(StaffUser newUser);
    }
}

