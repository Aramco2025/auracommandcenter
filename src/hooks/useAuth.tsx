
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasGoogleToken: boolean;
  refreshGoogleToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasGoogleToken, setHasGoogleToken] = useState(false);

  const refreshGoogleToken = async (): Promise<boolean> => {
    try {
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (refreshedSession) {
        setSession(refreshedSession);
        const hasToken = !!(refreshedSession.provider_token || refreshedSession.provider_refresh_token);
        setHasGoogleToken(hasToken);
        console.log('Token refreshed successfully:', hasToken);
        return hasToken;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        console.log('Session details:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          hasProviderToken: !!session?.provider_token,
          hasProviderRefreshToken: !!session?.provider_refresh_token,
          provider: session?.user?.app_metadata?.provider
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check for provider token more thoroughly
        const hasToken = !!(session?.provider_token || session?.provider_refresh_token);
        setHasGoogleToken(hasToken);
        
        // Store tokens in local storage for persistence
        if (session?.provider_token) {
          localStorage.setItem('google_access_token', session.provider_token);
        }
        if (session?.provider_refresh_token) {
          localStorage.setItem('google_refresh_token', session.provider_refresh_token);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasProviderToken: !!session?.provider_token,
        hasProviderRefreshToken: !!session?.provider_refresh_token,
        provider: session?.user?.app_metadata?.provider
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check for provider token more thoroughly
      const hasToken = !!(session?.provider_token || session?.provider_refresh_token);
      setHasGoogleToken(hasToken);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setHasGoogleToken(false);
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, hasGoogleToken, refreshGoogleToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
