import 'react-native-url-polyfill/auto'
import { createClient } from "@supabase/supabase-js"
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storeage: AsyncStorage,
    }
})