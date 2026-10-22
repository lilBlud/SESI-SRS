const { createClient } = require('./mobile-frontend/node_modules/@supabase/supabase-js');
const supabase = createClient('https://avlypjdoahothehakchf.supabase.co', 'sb_publishable__T0Lcs6Js5Iy8x3EVnMhsw_6Cj_gcxv');

async function test() {
  const tables = [
    'Visitors', 'visitors', 
    'VisitorLogs', 'visitor_logs', 
    'Traffic', 'traffic', 
    'UserActivities', 'StaffUsers', 
    'Visits', 'visits',
    'UserAnswers', 'GlossaryTerms', 'QuizQuestions', 'Infographics'
  ];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(3);
    console.log(t, error ? 'ERROR: ' + error.message : 'OK, rows: ' + (data ? data.length : 0));
    if (data && data.length > 0) {
      console.log('Sample row from', t, ':', JSON.stringify(data[0]));
    }
  }
}
test();
