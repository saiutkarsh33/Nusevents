import 'react-native-url-polyfill/auto'

import {createClient} from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPERBASE_PROJECT_URL
const supabaseKey = process.env.SUPERBASE_PROJECT_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)