
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hvqfeotifcbzumtmgbel.supabase.co'
const supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2cWZlb3RpZmNienVtdG1nYmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc3Mzc4MDgsImV4cCI6MjAyMzMxMzgwOH0.-03Iq_53QNZL_CpVQxQmUfRvQ9K2KMVWqPedW_APtkE'
export const supabase = createClient(supabaseUrl, supabaseKey)