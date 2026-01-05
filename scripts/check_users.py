
import { createClient } from '@supabase/supabase-client'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkUsers() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, condo_id, unit')
  
  if (error) {
    console.error('Error fetching profiles:', error)
    return
  }

  console.log('--- Profiles ---')
  profiles.forEach(p => {
    console.log(`ID: ${p.id} | Name: ${p.full_name} | Role: ${p.role} | Condo: ${p.condo_id} | Unit: ${p.unit}`)
  })
}

checkUsers()
