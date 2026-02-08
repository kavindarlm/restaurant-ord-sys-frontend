
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://untgtsclbjlgemwljimq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudGd0c2NsYmpsZ2Vtd2xqaW1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODkwNzcyNywiZXhwIjoyMDU0NDgzNzI3fQ.R8mveo0moDnrAXw8mh4OWnVPF4UBR2oeQeFsLhS6iFQ';

export const supabase = createClient(supabaseUrl, supabaseKey);