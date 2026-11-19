using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace mobile_backend.Services
{
    public record GenerateQuizFilePayload(
        string? Name,
        string? MimeType,
        string? Base64
    );

    public record GenerateQuizRequest(
        int Count,
        string? Difficulty,
        string? Month,
        string? Focus,
        string? Text,
        GenerateQuizFilePayload? File,
        List<string>? ExistingQuestions
    );

    public record GeneratedQuizDraft(
        string QuestionText,
        string OptionA,
        string OptionB,
        string OptionC,
        string OptionD,
        string CorrectOption,
        string SourceSnippet
    );

    public record GenerateQuizResult(
        bool Success,
        int StatusCode,
        string? Error,
        string? Model,
        List<GeneratedQuizDraft> Questions
    );

    public interface IQuizGeneratorService
    {
        Task<GenerateQuizResult> GenerateFromDocumentAsync(GenerateQuizRequest request, CancellationToken ct = default);
    }

    public class QuizGeneratorService : IQuizGeneratorService
    {
        private static readonly HashSet<string> AllowedMimes = new(StringComparer.OrdinalIgnoreCase)
        {
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/webp"
        };

        private const int MaxBase64Length = 16 * 1024 * 1024;
        private const int MaxTextLength = 120_000;

        private static readonly JsonSerializerOptions JsonOpts = new()
        {
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public QuizGeneratorService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _httpClient.Timeout = TimeSpan.FromSeconds(90);
            _config = config;
        }

        public async Task<GenerateQuizResult> GenerateFromDocumentAsync(GenerateQuizRequest request, CancellationToken ct = default)
        {
            var apiKey = (_config["Gemini:ApiKey"] ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY") ?? string.Empty).Trim();
            var model = (_config["Gemini:Model"] ?? Environment.GetEnvironmentVariable("GEMINI_MODEL") ?? "gemini-2.5-flash").Trim();
            if (string.IsNullOrWhiteSpace(model)) model = "gemini-2.5-flash";

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                return new GenerateQuizResult(
                    false,
                    503,
                    "GEMINI_API_KEY is not configured for local mobile-backend. Set Gemini:ApiKey in mobile-backend/appsettings.Development.json or set the GEMINI_API_KEY environment variable and restart mobile-backend.",
                    null,
                    new List<GeneratedQuizDraft>());
            }

            var count = Math.Clamp(request.Count <= 0 ? 5 : request.Count, 1, 15);
            var difficulty = (request.Difficulty ?? "mixed").Trim().ToLowerInvariant();
            var focus = (request.Focus ?? string.Empty).Trim();
            if (focus.Length > 500) focus = focus[..500];

            var text = (request.Text ?? string.Empty).Trim();
            if (text.Length > MaxTextLength) text = text[..MaxTextLength];

            var hasFile = !string.IsNullOrWhiteSpace(request.File?.Base64);
            if (string.IsNullOrWhiteSpace(text) && !hasFile)
            {
                return new GenerateQuizResult(
                    false,
                    400,
                    "Please provide a document file or source text to generate questions from.",
                    null,
                    new List<GeneratedQuizDraft>());
            }

            var parts = new List<object>();

            if (hasFile)
            {
                var mimeType = (request.File!.MimeType ?? string.Empty).Trim().ToLowerInvariant();
                if (!AllowedMimes.Contains(mimeType))
                {
                    return new GenerateQuizResult(
                        false,
                        400,
                        $"Unsupported file MIME type: {(string.IsNullOrWhiteSpace(mimeType) ? "unknown" : mimeType)}.",
                        null,
                        new List<GeneratedQuizDraft>());
                }

                if (request.File.Base64!.Length > MaxBase64Length)
                {
                    return new GenerateQuizResult(
                        false,
                        413,
                        "Uploaded document exceeds the maximum allowed size (10 MB).",
                        null,
                        new List<GeneratedQuizDraft>());
                }

                parts.Add(new
                {
                    inlineData = new
                    {
                        mimeType,
                        data = request.File.Base64
                    }
                });
            }

            if (!string.IsNullOrWhiteSpace(text))
            {
                parts.Add(new { text = $"SOURCE DOCUMENT CONTENT:\n{text}" });
            }

            parts.Add(new { text = BuildPrompt(count, difficulty, focus, request.ExistingQuestions) });

            var payload = new
            {
                contents = new[]
                {
                    new { role = "user", parts }
                },
                generationConfig = new
                {
                    temperature = 0.4,
                    responseMimeType = "application/json",
                    responseSchema = new
                    {
                        type = "OBJECT",
                        properties = new
                        {
                            questions = new
                            {
                                type = "ARRAY",
                                items = new
                                {
                                    type = "OBJECT",
                                    properties = new
                                    {
                                        questionText = new { type = "STRING" },
                                        optionA = new { type = "STRING" },
                                        optionB = new { type = "STRING" },
                                        optionC = new { type = "STRING" },
                                        optionD = new { type = "STRING" },
                                        correctOption = new { type = "STRING", @enum = new[] { "A", "B", "C", "D" } },
                                        sourceSnippet = new { type = "STRING" }
                                    },
                                    required = new[]
                                    {
                                        "questionText",
                                        "optionA",
                                        "optionB",
                                        "optionC",
                                        "optionD",
                                        "correctOption"
                                    }
                                }
                            }
                        },
                        required = new[] { "questions" }
                    }
                }
            };

            var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/{Uri.EscapeDataString(model)}:generateContent?key={Uri.EscapeDataString(apiKey)}";

            HttpResponseMessage geminiRes;
            try
            {
                using var httpReq = new HttpRequestMessage(HttpMethod.Post, endpoint)
                {
                    Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
                };
                geminiRes = await _httpClient.SendAsync(httpReq, ct);
            }
            catch (Exception ex)
            {
                return new GenerateQuizResult(false, 502, $"Failed to reach Gemini API: {ex.Message}", null, new List<GeneratedQuizDraft>());
            }

            var rawBody = await geminiRes.Content.ReadAsStringAsync(ct);

            if (!geminiRes.IsSuccessStatusCode)
            {
                var upstreamMsg = ExtractGeminiError(rawBody) ?? $"Gemini API returned HTTP {(int)geminiRes.StatusCode}.";
                var mappedStatus = geminiRes.StatusCode == HttpStatusCode.TooManyRequests ? 429 : 502;
                return new GenerateQuizResult(false, mappedStatus, upstreamMsg, null, new List<GeneratedQuizDraft>());
            }

            var candidateText = ExtractCandidateText(rawBody);
            if (string.IsNullOrWhiteSpace(candidateText))
            {
                return new GenerateQuizResult(false, 502, "Gemini returned an empty response. Try again or shorten the document.", null, new List<GeneratedQuizDraft>());
            }

            List<GeneratedQuizDraft> sanitized;
            try
            {
                using var doc = JsonDocument.Parse(candidateText);
                sanitized = SanitizeQuestions(doc.RootElement, count);
            }
            catch
            {
                return new GenerateQuizResult(false, 502, "Gemini returned malformed JSON. Please retry.", null, new List<GeneratedQuizDraft>());
            }

            return new GenerateQuizResult(true, 200, null, model, sanitized);
        }

        private static string BuildPrompt(int count, string difficulty, string focus, List<string>? existingQuestions)
        {
            var difficultyGuide = difficulty switch
            {
                "basic" => "Basic recall & foundational understanding suitable for all staff.",
                "technical" => "Technical regulatory, engineering, formula, and operational depth.",
                _ => "A balanced mix of foundational understanding, practical application, and technical detail."
            };

            var sb = new StringBuilder();
            sb.AppendLine("You are an instructional designer for Sabah Electricity Supply Industry (SESI).");
            sb.AppendLine($"Generate EXACTLY {count} multiple-choice quiz questions strictly grounded in the provided document or text.");
            sb.AppendLine($"Difficulty level: {difficultyGuide}");

            if (!string.IsNullOrWhiteSpace(focus))
            {
                sb.AppendLine($"\nAdditional admin focus instruction: {focus}");
            }

            if (existingQuestions != null && existingQuestions.Count > 0)
            {
                sb.AppendLine("\nDo NOT repeat or closely paraphrase any of these existing questions:");
                var i = 1;
                foreach (var q in existingQuestions.Where(x => !string.IsNullOrWhiteSpace(x)).Take(60))
                {
                    sb.AppendLine($"{i++}. {q.Trim()}");
                }
            }

            sb.AppendLine("\nRules:");
            sb.AppendLine("- Every question must be self-contained, clear, unambiguous, and factually verifiable from the provided source.");
            sb.AppendLine("- Provide exactly 4 distinct, plausible options (optionA, optionB, optionC, optionD) of similar length and tone.");
            sb.AppendLine("- Do NOT include letter prefixes like \"A.\" or \"B)\" inside optionA..optionD.");
            sb.AppendLine("- Distribute correctOption evenly across \"A\", \"B\", \"C\", and \"D\".");
            sb.AppendLine("- Include a concise sourceSnippet (max 140 chars) quoting or pointing to the exact section/fact in the document that proves the answer.");
            sb.AppendLine("- Return ONLY valid JSON matching the requested schema.");

            return sb.ToString();
        }

        private static string? ExtractGeminiError(string rawBody)
        {
            try
            {
                using var doc = JsonDocument.Parse(rawBody);
                if (doc.RootElement.TryGetProperty("error", out var err) &&
                    err.TryGetProperty("message", out var msg))
                {
                    return msg.GetString();
                }
            }
            catch
            {
                // Ignore parse error
            }
            return null;
        }

        private static string ExtractCandidateText(string rawBody)
        {
            try
            {
                using var doc = JsonDocument.Parse(rawBody);
                if (!doc.RootElement.TryGetProperty("candidates", out var candidates) ||
                    candidates.ValueKind != JsonValueKind.Array ||
                    candidates.GetArrayLength() == 0)
                {
                    return string.Empty;
                }

                var first = candidates[0];
                if (!first.TryGetProperty("content", out var content) ||
                    !content.TryGetProperty("parts", out var parts) ||
                    parts.ValueKind != JsonValueKind.Array)
                {
                    return string.Empty;
                }

                var sb = new StringBuilder();
                foreach (var p in parts.EnumerateArray())
                {
                    if (p.TryGetProperty("text", out var t))
                    {
                        sb.Append(t.GetString());
                    }
                }
                return sb.ToString().Trim();
            }
            catch
            {
                return string.Empty;
            }
        }

        private static List<GeneratedQuizDraft> SanitizeQuestions(JsonElement root, int maxCount)
        {
            var results = new List<GeneratedQuizDraft>();
            if (!root.TryGetProperty("questions", out var list) || list.ValueKind != JsonValueKind.Array)
            {
                return results;
            }

            foreach (var item in list.EnumerateArray())
            {
                if (item.ValueKind != JsonValueKind.Object) continue;

                var qText = GetString(item, "questionText");
                var optA = GetString(item, "optionA");
                var optB = GetString(item, "optionB");
                var optC = GetString(item, "optionC");
                var optD = GetString(item, "optionD");
                var rawCorrect = GetString(item, "correctOption").ToUpperInvariant();
                var correct = rawCorrect is "A" or "B" or "C" or "D" ? rawCorrect : "A";
                var snippet = GetString(item, "sourceSnippet");
                if (snippet.Length > 220) snippet = snippet[..220];

                if (string.IsNullOrWhiteSpace(qText) ||
                    string.IsNullOrWhiteSpace(optA) ||
                    string.IsNullOrWhiteSpace(optB) ||
                    string.IsNullOrWhiteSpace(optC) ||
                    string.IsNullOrWhiteSpace(optD))
                {
                    continue;
                }

                results.Add(new GeneratedQuizDraft(qText, optA, optB, optC, optD, correct, snippet));
                if (results.Count >= maxCount) break;
            }

            return results;
        }

        private static string GetString(JsonElement obj, string prop)
        {
            if (obj.TryGetProperty(prop, out var el) && el.ValueKind == JsonValueKind.String)
            {
                return (el.GetString() ?? string.Empty).Trim();
            }
            return string.Empty;
        }
    }
}
