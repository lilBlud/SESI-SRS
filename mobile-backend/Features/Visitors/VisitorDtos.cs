using System;
using System.Collections.Generic;

namespace mobile_backend.DTOs
{
    public record DivisionBreakdownDto(string Division, int Count);

    public record RecentVisitDto(
        int Id,
        string VisitorId,
        string Username,
        string Division,
        DateTime VisitedAt
    );

    public record VisitorStatsDto(
        int TotalVisits,
        int TodayVisits,
        int UniqueVisitors,
        List<DivisionBreakdownDto> DivisionBreakdown,
        List<RecentVisitDto> RecentVisits
    );

    public record RecordVisitorResultDto(
        int TotalVisits,
        int TodayVisits,
        int UniqueVisitors
    );
}
