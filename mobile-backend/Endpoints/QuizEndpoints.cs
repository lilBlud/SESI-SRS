using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using mobile_backend.Models;
using mobile_backend.Services;

namespace mobile_backend.Endpoints
{
    public static class QuizEndpoints
    {
        public static WebApplication MapQuizEndpoints(this WebApplication app)
        {
            // ─── Quiz: Get Questions for Month ───
            app.MapGet("/api/quiz/{month}", async (string month, IQuizService svc) =>
                Results.Ok(await svc.GetQuizQuestionsAsync(month))).WithName("GetMonthlyQuiz");

            // ─── Quiz: Get All Available Questions Summary ───
            app.MapGet("/api/quiz-summary", async (IQuizService svc) =>
                Results.Ok(await svc.GetQuizSummaryAsync())).WithName("GetQuizSummary");

            // ─── Quiz: Get User Answers for Month ───
            app.MapGet("/api/quiz-status/{month}/{username}", async (string month, string username, IQuizService svc) =>
                Results.Ok(await svc.GetUserRecentAnswersAsync(username, month))).WithName("GetUserQuizStatus");

            // ─── Quiz: Submit Answer ───
            app.MapPost("/api/submit-answer", async (UserAnswer answer, IQuizService svc) =>
                Results.Ok(await svc.SubmitAnswerAsync(answer))).WithName("SubmitAnswer");

            // ─── Leaderboard: Total score per user for the month, sorted highest first ───
            app.MapGet("/api/leaderboard/{month}", async (string month, IQuizService svc) =>
                Results.Ok(await svc.GetLeaderboardAsync(month))).WithName("GetLeaderboard");

            return app;
        }
    }
}
