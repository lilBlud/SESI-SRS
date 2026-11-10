using System.Collections.Generic;
using System.Threading.Tasks;
using mobile_backend.DTOs;
using mobile_backend.Models;

namespace mobile_backend.Services
{
    public interface IGlossaryService
    {
        Task<List<GlossaryTermDto>> GetGlossaryAsync();
        Task<List<InfographicDto>> GetInfographicsAsync();
        Task<GlossaryTerm> AddGlossaryTermAsync(GlossaryTerm term);
        Task<GlossaryTerm?> UpdateGlossaryTermAsync(int id, GlossaryTerm updated);
        Task<bool> DeleteGlossaryTermAsync(int id);
        Task<Infographic> AddInfographicAsync(Infographic info);
        Task<Infographic?> UpdateInfographicAsync(int id, Infographic update);
        Task<bool> DeleteInfographicAsync(int id);
    }
}

