"use client";

import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";
import { useState, useEffect, createContext, useContext } from "react";

type AuthContextType = {
  authUser: User | null;
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (
    email: string,
    password: string,
    username: string,
    fullName: string
  ) => Promise<any>;
  signOut: () => Promise<void>;
  getUser: (id: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const getUser = async (id: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    setUser(data);
    return data || null || error;
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (data.user) {
        setAuthUser(data.user);
      }
      return { data, error };
    } catch (error) {
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred"),
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    username: string,
    fullName: string
  ) => {
    try {
      setLoading(true);
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();

      if (existingUser) {
        return {
          data: null,
          error: new Error("Username is already taken"),
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { data: null, error };
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          username,
          full_name: fullName,
          theme: "light",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          await supabase.auth.admin.deleteUser(data.user.id);
          return {
            data: null,
            error: new Error(
              "Failed to create profile: " + profileError.message
            ),
          };
        }

        setAuthUser(data.user);
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred"),
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getUser(session.user.id);
        setAuthUser(session.user);
      } else {
        setAuthUser(null);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUser(session.user.id);
        setAuthUser(session.user);
      } else {
        setAuthUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ authUser, user, loading, signIn, signUp, signOut, getUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
