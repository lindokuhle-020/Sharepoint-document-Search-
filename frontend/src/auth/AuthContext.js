import { createContext, useCallback, useContext, useState } from 'react';
import { DEMO_ACCOUNT, loginRequest, msalConfig } from './authConfig';

/**
 * Authentication context for the portal.
 *
 * The portal is designed for Microsoft Entra ID (single sign-on with the
 * government Microsoft 365 tenant). Until MSAL is configured, it runs in
 * DEMO MODE: signing in simply stores a placeholder account locally so the
 * signed-in experience (My activity, account menu) can be developed and
 * demonstrated.
 *
 * To go live, install @azure/msal-browser, create a PublicClientApplication
 * from msalConfig and follow the TODO(Entra ID) comments below.
 */

const STORAGE_KEY = 'sds.account';

const AuthContext = createContext(null);

function readStoredAccount() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(readStoredAccount);

  const signIn = useCallback(async () => {
    // TODO(Entra ID): replace this demo block with the MSAL redirect flow:
    //
    //   const msalInstance = new PublicClientApplication(msalConfig);
    //   await msalInstance.initialize();
    //   const response = await msalInstance.loginRedirect(loginRequest);
    //   setAccount(response.account);
    //
    // Keep the stored-account behaviour for page refreshes, or read the
    // account from msalInstance.getAllAccounts()[0] on mount instead.
    void msalConfig;
    void loginRequest;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ACCOUNT));
    setAccount(DEMO_ACCOUNT);
    return DEMO_ACCOUNT;
  }, []);

  const signOut = useCallback(async () => {
    // TODO(Entra ID): replace with the MSAL logout redirect:
    //
    //   const msalInstance = new PublicClientApplication(msalConfig);
    //   await msalInstance.logoutRedirect();
    window.localStorage.removeItem(STORAGE_KEY);
    setAccount(null);
  }, []);

  const value = {
    account,
    isAuthenticated: Boolean(account),
    isDemo: !account || Boolean(account.isDemo),
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook for accessing the auth state. Must be used inside <AuthProvider>. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}
