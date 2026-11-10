import { IS_LOCAL_SSMS } from './apiConfig';
import { ssmsProvider } from './providers/ssms/ssmsProvider';
import { supabaseProvider } from './providers/supabase/supabaseProvider';

/**
 * Data Provider Factory
 *
 * Enforces architectural boundary:
 * - Local Environment: ssmsProvider (Local ASP.NET Core API on port 5195 -> SQL Server SesiSrs)
 * - Git Repo / Cloudflare Production: supabaseProvider (Supabase Cloud SDK)
 */
export function getActiveProvider() {
  if (IS_LOCAL_SSMS) {
    return ssmsProvider;
  }
  return supabaseProvider;
}

export const dataProvider = getActiveProvider();
export { IS_LOCAL_SSMS };

