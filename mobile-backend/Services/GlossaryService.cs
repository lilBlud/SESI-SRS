using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.DTOs;
using mobile_backend.Models;

namespace mobile_backend.Services
{
    public class GlossaryService(AppDbContext db) : IGlossaryService
    {
        public async Task<List<GlossaryTermDto>> GetGlossaryAsync()
        {
            var terms = await db.GlossaryTerms.OrderBy(g => g.Term).ToListAsync();
            return [.. terms.Select(g => new GlossaryTermDto(
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
        }

        public async Task<List<InfographicDto>> GetInfographicsAsync()
        {
            var items = await db.Infographics.OrderByDescending(i => i.PostedAt).ToListAsync();
            return [.. items.Select(i => new InfographicDto(
                i.Id,
                i.Title,
                i.Description,
                i.ImageUrl,
                i.AdditionalImages,
                i.Category,
                i.PostedAt
            ))];
        }

        public async Task<GlossaryTerm> AddGlossaryTermAsync(GlossaryTerm term)
        {
            term.CreatedAt = DateTime.UtcNow;
            db.GlossaryTerms.Add(term);
            await db.SaveChangesAsync();
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
            return existing;
        }

        public async Task<bool> DeleteGlossaryTermAsync(int id)
        {
            var t = await db.GlossaryTerms.FindAsync(id);
            if (t == null) return false;
            db.GlossaryTerms.Remove(t);
            await db.SaveChangesAsync();
            return true;
        }

        public async Task<Infographic> AddInfographicAsync(Infographic info)
        {
            info.PostedAt = DateTime.UtcNow;
            db.Infographics.Add(info);
            await db.SaveChangesAsync();
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
            return i;
        }

        public async Task<bool> DeleteInfographicAsync(int id)
        {
            var i = await db.Infographics.FindAsync(id);
            if (i == null) return false;
            db.Infographics.Remove(i);
            await db.SaveChangesAsync();
            return true;
        }
    }
}
