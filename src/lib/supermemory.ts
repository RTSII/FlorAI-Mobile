import { createClient } from '@supabase/supabase-js';

const supermemoryUrl = process.env.NEXT_PUBLIC_SUPERMEMORY_API_URL || '';
const supermemoryKey = process.env.NEXT_PUBLIC_SUPERMEMORY_API_KEY || '';

export const supermemory = createClient(supermemoryUrl, supermemoryKey);
