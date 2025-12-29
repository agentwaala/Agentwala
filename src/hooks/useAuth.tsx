import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "agent" | "customer";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  roleLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  setUserRole: (role: AppRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);

  const computeHighestRole = (roles: AppRole[]) => {
    if (roles.includes("admin")) return "admin" as const;
    if (roles.includes("agent")) return "agent" as const;
    return "customer" as const;
  };

  const fetchUserRole = async (userId: string) => {
    setRoleLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        setRole(null);
        return null;
      }

      if (data && data.length > 0) {
        const roles = data.map((d) => d.role as AppRole);
        const highest = computeHighestRole(roles);
        setRole(highest);
        return highest;
      }

      setRole(null);
      return null;
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const applySession = async (nextSession: Session | null) => {
      if (!mounted) return;

      setLoading(true);
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await fetchUserRole(nextSession.user.id);
      } else {
        setRole(null);
        setRoleLoading(false);
      }

      if (mounted) setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Fire and forget; applySession manages loading state.
      void applySession(nextSession);
    });

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => applySession(session));

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user && !data.session) {
      // Email confirmation required
      return { error: null };
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setRoleLoading(false);
  };

  const ensureAgentRowExists = async (userId: string) => {
    const { data: existing, error: existingError } = await supabase
      .from("agents")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingError) return;
    if (existing) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .maybeSingle();

    await supabase.from("agents").insert({
      user_id: userId,
      full_name: profile?.full_name || user?.email?.split("@")[0] || "Agent",
      available: false,
      profile_complete: false,
    });
  };

  const setUserRole = async (newRole: AppRole) => {
    if (!user) return;

    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: user.id, role: newRole });

    // Ignore duplicate role inserts (unique constraint)
    if (error && (error as any)?.code !== "23505") {
      throw error;
    }

    if (newRole === "agent") {
      await ensureAgentRowExists(user.id);
    }

    // Always re-fetch to apply role priority (admin > agent > customer)
    await fetchUserRole(user.id);
  };

  const value = useMemo(
    () => ({
      user,
      session,
      role,
      loading,
      roleLoading,
      signUp,
      signIn,
      signOut,
      setUserRole,
    }),
    [user, session, role, loading, roleLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
