import { useRouter, useSegments } from "expo-router";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

// When user is logged in as a personal account, he will enter the app with screens of a personal account
// and vice versa for a business account




// Creation of AuthContext and useAuth which we use to obtain our user, throughout the entire application



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
      console.log(`inAuthGroup: ${inAuthGroup}`);
      router.replace("/login");
    } else if (user && inAuthGroup) {
      console.log(`inAuthGroup: ${inAuthGroup}`);
      const loginRoute = async () => {
        const { data, error } = await supabase
          .from("users")
          .select()
          .eq("id", user.id)
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
      loginRoute();
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
    <AuthContext.Provider value={{ user}}>{children}</AuthContext.Provider>
  );
}
