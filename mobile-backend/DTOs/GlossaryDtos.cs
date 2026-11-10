using System;
using System.Collections.Generic;

namespace mobile_backend.DTOs
{
    public record GlossaryTermDto(
        int Id,
        string Term,
        string Full,
        string Desc,
        string Formula,
        string FormulaNotations,
        string FormulaTermMeanings,
        string Cat,
        string ChartData
    );

    public record InfographicDto(
        int Id,
        string Title,
        string Description,
        string ImageUrl,
        string AdditionalImages,
        string Category,
        DateTime PostedAt
    );
}

