using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using mobile_backend.Data;
using mobile_backend.DTOs;
using mobile_backend.Models;

namespace mobile_backend.Services
{
    public class GlossaryService(AppDbContext db, IMemoryCache cache) : IGlossaryService
    {
        private const string GlossaryCacheKey = "sesi_glossary_all";
        private const string InfographicsCacheKey = "sesi_infographics_all";

        public async Task<List<GlossaryTermDto>> GetGlossaryAsync()
        {
            if (cache.TryGetValue(GlossaryCacheKey, out List<GlossaryTermDto>? cached) && cached != null)
            {
                return cached;
            }

            var terms = await db.GlossaryTerms.AsNoTracking().OrderBy(g => g.Term).ToListAsync();
            List<GlossaryTermDto> result = [.. terms.Select(g => new GlossaryTermDto(
                g.Id,
                g.Term,
                g.FullName,
                g.Description,
                g.Formula,
                g.FormulaNotations,
                g.FormulaTermMeanings,
                g.Category,
                g.ChartData
            ))];

            cache.Set(GlossaryCacheKey, result, TimeSpan.FromMinutes(10));
            return result;
        }

        public async Task<List<InfographicDto>> GetInfographicsAsync()
        {
            if (cache.TryGetValue(InfographicsCacheKey, out List<InfographicDto>? cached) && cached != null)
            {
                return cached;
            }

            var items = await db.Infographics.AsNoTracking().OrderByDescending(i => i.PostedAt).ToListAsync();
            List<InfographicDto> result = [.. items.Select(i => new InfographicDto(
                i.Id,
                i.Title,
                i.Description,
                i.ImageUrl,
                i.AdditionalImages,
                i.Category,
                i.PostedAt
            ))];

            cache.Set(InfographicsCacheKey, result, TimeSpan.FromMinutes(10));
            return result;
        }

        public async Task<GlossaryTerm> AddGlossaryTermAsync(GlossaryTerm term)
        {
            term.CreatedAt = DateTime.UtcNow;
            db.GlossaryTerms.Add(term);
            await db.SaveChangesAsync();
            cache.Remove(GlossaryCacheKey);
            return term;
        }

        public async Task<GlossaryTerm?> UpdateGlossaryTermAsync(int id, GlossaryTerm updated)
        {
            var existing = await db.GlossaryTerms.FindAsync(id);
            if (existing == null) return null;

            existing.Term = updated.Term;
            existing.FullName = updated.FullName;
            existing.Description = updated.Description;
            existing.Formula = updated.Formula;
            existing.FormulaNotations = updated.FormulaNotations;
            existing.FormulaTermMeanings = updated.FormulaTermMeanings;
            existing.Category = updated.Category;
            existing.ChartData = updated.ChartData;

            await db.SaveChangesAsync();
            cache.Remove(GlossaryCacheKey);
            return existing;
        }

        public async Task<bool> DeleteGlossaryTermAsync(int id)
        {
            var t = await db.GlossaryTerms.FindAsync(id);
            if (t == null) return false;
            db.GlossaryTerms.Remove(t);
            await db.SaveChangesAsync();
            cache.Remove(GlossaryCacheKey);
            return true;
        }

        public async Task<Infographic> AddInfographicAsync(Infographic info)
        {
            info.PostedAt = DateTime.UtcNow;
            db.Infographics.Add(info);
            await db.SaveChangesAsync();
            cache.Remove(InfographicsCacheKey);
            return info;
        }

        public async Task<Infographic?> UpdateInfographicAsync(int id, Infographic update)
        {
            var i = await db.Infographics.FindAsync(id);
            if (i == null) return null;

            i.Title = update.Title;
            i.Description = update.Description;
            i.ImageUrl = update.ImageUrl;
            i.AdditionalImages = update.AdditionalImages;
            i.Category = update.Category;

            await db.SaveChangesAsync();
            cache.Remove(InfographicsCacheKey);
            return i;
        }

        public async Task<bool> DeleteInfographicAsync(int id)
        {
            var i = await db.Infographics.FindAsync(id);
            if (i == null) return false;
            db.Infographics.Remove(i);
            await db.SaveChangesAsync();
            cache.Remove(InfographicsCacheKey);
            return true;
        }
    }
}
