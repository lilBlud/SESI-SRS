using System;
using System.Collections.Generic;

namespace mobile_backend.DTOs
{
    public record QuizQuestionDto(
        int Id,
        string Question,
        string[] Options,
        int CorrectIndex
    );

    public record QuizSummaryDto(
        int Id,
        string Month
    );

    public record LeaderboardEntryDto(
        string Key,
        string Username,
        string DisplayName,
        int Score,
        string Division,
        DateTime? DateTaken,
        int Streak,
        string? ProfilePicture,
        int? StaffId
    );

    public record UserAnswerDto(
        int Id,
        string Month,
        int QuestionId,
        string QuestionText,
        string SelectedOption,
        bool IsCorrect,
        int TimeTakenSeconds,
        int PointsAwarded,
        DateTime DateAnswered,
        string Username,
        string? PreferredName,
        string? Division
    );
}

