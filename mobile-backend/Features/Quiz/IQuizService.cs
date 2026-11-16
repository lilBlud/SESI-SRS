using System.Collections.Generic;
using System.Threading.Tasks;
using mobile_backend.DTOs;
using mobile_backend.Models;

namespace mobile_backend.Services
{
    public interface IQuizService
    {
        Task<List<QuizQuestionDto>> GetQuizQuestionsAsync(string month);
        Task<List<QuizSummaryDto>> GetQuizSummaryAsync();
        Task<List<LeaderboardEntryDto>> GetLeaderboardAsync(string month);
        Task<UserAnswer> SubmitAnswerAsync(UserAnswer answer);
        Task<List<UserAnswerDto>> GetUserRecentAnswersAsync(string username, string? month);
        Task<List<string>> GetUserActiveMonthsAsync(string username);
    }
}

