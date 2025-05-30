
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

  const checkTokenAvailability = (session: Session | null) => {
    if (!session) {
      setHasGoogleToken(false);
      return false;
    }

    // Check multiple sources for tokens
    const hasProviderToken = !!(session.provider_token || session.provider_refresh_token);
    const hasStoredToken = !!(localStorage.getItem('google_access_token') || localStorage.getItem('google_refresh_token'));
    const hasUserToken = !!(session.user?.user_metadata?.provider_token);
    
    const hasAnyToken = hasProviderToken || hasStoredToken || hasUserToken;
    setHasGoogleToken(hasAnyToken);
    
    console.log('Token availability check:', {
      hasProviderToken,
      hasStoredToken,
      hasUserToken,
      finalResult: hasAnyToken
    });
    
    return hasAnyToken;
  };

  const refreshGoogleToken = async (): Promise<boolean> => {
    try {
      console.log('Attempting to refresh Google token...');
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Token refresh error:', error);
        throw error;
      }
      
      if (refreshedSession) {
        setSession(refreshedSession);
        const hasToken = checkTokenAvailability(refreshedSession);
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
        
        // Enhanced token persistence
        if (session?.provider_token) {
          localStorage.setItem('google_access_token', session.provider_token);
          console.log('Stored provider token');
        }
        if (session?.provider_refresh_token) {
          localStorage.setItem('google_refresh_token', session.provider_refresh_token);
          console.log('Stored refresh token');
        }
        
        // Store additional token sources
        if (session?.user?.user_metadata?.provider_token) {
          localStorage.setItem('google_user_token', session.user.user_metadata.provider_token);
          console.log('Stored user metadata token');
        }
        
        checkTokenAvailability(session);
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
      checkTokenAvailability(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setHasGoogleToken(false);
    // Clear all token storage
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    localStorage.removeItem('google_user_token');
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
