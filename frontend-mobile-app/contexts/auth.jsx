import { useRouter, useSegments } from "expo-router";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log(`useProtectedRoute useEffect called`);
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) {
      // !user means if user === null
      console.log(`inAuthGroup: ${inAuthGroup}`);
      router.replace("/login");
    } else if (user && inAuthGroup) {
      console.log(`inAuthGroup: ${inAuthGroup}`);
      const filterData = async () => {
        const { data, error } = await supabase
          .from("accounts")
          .select()
          .eq("user_id", user.id)
          .single();

        if (error != null) {
          console.log(error);
          return;
        }
        if (data.account_type === "Business") {
          router.replace("/(businessAcc)/");
        } else if (data.account_type === "Personal") {
          router.replace("/(personalAcc)/");
        }
      };
      filterData();
    }
  }, [user, segments, router]);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useProtectedRoute(user);

  useEffect(() => {
    console.log(`AuthProvider useEffect called`);
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`onAuthStateChange event: ${event}`);
      if (event === "SIGNED_IN") {
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
