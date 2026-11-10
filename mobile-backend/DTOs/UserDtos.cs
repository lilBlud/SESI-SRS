using System;
using System.Collections.Generic;

namespace mobile_backend.DTOs
{
    public record UserProfileDto(
        int Id,
        string FullName,
        string PreferredName,
        string Email,
        string Division,
        string StaffId,
        string ProfilePicture,
        string Role,
        DateTime? CreatedAt
    );

    public record StreakDto(
        int Streak,
        List<string> Dates
    );

    public record ReadActivityDto(
        int Streak,
        bool Recorded
    );

    public record AuthResponseDto(
        int Id,
        string FullName,
        string PreferredName,
        string Email,
        string Division,
        string StaffId,
        string ProfilePicture,
        string Role
    );
}

