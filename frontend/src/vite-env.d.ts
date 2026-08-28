/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_SIMULATION_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Ambient wildcard module declarations for IDE type-checkers before npm install
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element extends any {}
  interface ElementClass extends any {}
}

declare module 'react' {
  export = React;
  export as namespace React;
  namespace React {
    type ReactNode = any;
    type FC<P = {}> = (props: P) => any;
    type ComponentType<P = {}> = any;
    interface Context<T> {
      Provider: FC<{ value: T; children?: ReactNode }>;
      Consumer: FC<{ children: (value: T) => ReactNode }>;
      displayName?: string;
    }
    function useState<T>(initialState: T | (() => T)): [T, (val: T | ((prev: T) => T)) => void];
    function useEffect(effect: () => void | (() => void), deps?: any[]): void;
    function useContext<T>(context: Context<T>): T;
    function createContext<T>(defaultValue: T): Context<T>;
    function useRef<T = any>(initialValue?: T | null): { current: T | any };
    function useMemo<T>(factory: () => T, deps: any[]): T;
    function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
    function forwardRef<T, P = {}>(render: (props: P, ref: any) => any): any;
    const StrictMode: any;
    const Suspense: FC<{ fallback?: ReactNode; children?: ReactNode }>;
    function lazy<T = any>(factory: () => Promise<{ default: T }>): FC<any>;
    interface ButtonHTMLAttributes<T> extends Record<string, any> {}
    interface HTMLAttributes<T> extends Record<string, any> {}
    interface InputHTMLAttributes<T> extends Record<string, any> {}
    interface ChangeEvent<T = any> {
      target: { value: any };
    }
    interface FormEvent<T = any> {
      preventDefault: () => void;
    }
    interface ReactElement<P = any, T extends any = any> {}
  }
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react-dom/client';

declare module 'react-router-dom' {
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Navigate: any;
  export const Outlet: any;
  export const NavLink: any;
  export function useNavigate(): (path: string, options?: any) => void;
  export function useParams<T = Record<string, string>>(): T;
  export function useSearchParams(): [URLSearchParams, (params: any) => void];
}

declare module 'lucide-react';
declare module 'recharts';
declare module 'date-fns';

declare module 'axios' {
  export interface AxiosInstance {
    get<T = any>(url: string, config?: any): Promise<{ data: T }>;
    post<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }>;
    put<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }>;
    delete<T = any>(url: string, config?: any): Promise<{ data: T }>;
  }
  const axios: {
    create: (config?: any) => AxiosInstance;
    get: <T = any>(url: string, config?: any) => Promise<{ data: T }>;
    post: <T = any>(url: string, data?: any, config?: any) => Promise<{ data: T }>;
  };
  export default axios;
}

declare module 'firebase/app';
declare module 'firebase/auth';
declare module 'firebase/firestore';
declare module 'clsx';
declare module 'tailwind-merge';
