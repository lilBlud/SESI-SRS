using System.Threading.Tasks;
using mobile_backend.DTOs;
using mobile_backend.Models;

namespace mobile_backend.Services
{
    public interface IVisitorService
    {
        Task<VisitorStatsDto> GetVisitorStatsAsync();
        Task<RecordVisitorResultDto> RecordVisitAsync(RecordVisitRequest req, string remoteIp, string userAgent);
    }
}

