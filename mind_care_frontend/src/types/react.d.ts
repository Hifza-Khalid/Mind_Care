import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouterDOM from 'react-router-dom';

declare global {
  const React: typeof React;
  const ReactDOM: typeof ReactDOM;
  const ReactRouterDOM: typeof ReactRouterDOM;
}

declare module 'react' {
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
  }
  
  interface FC<P = {}> extends FunctionComponent<P> {}
  
  export const useEffect: (effect: () => void | (() => void | undefined), deps?: ReadonlyArray<any>) => void;
  export const useState: <T>(initialState: T | (() => T)) => [T, (newState: T | ((prevState: T) => T)) => void];
  export const useRef: <T>(initialValue: T) => { current: T };
  export const useCallback: <T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>) => T;
  export const useMemo: <T>(factory: () => T, deps: ReadonlyArray<any>) => T;
  
  export type ReactNode = 
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | boolean
    | null
    | undefined;
    
  export type DetailedHTMLProps<E extends React.HTMLAttributes<T>, T> = {
    [K in keyof E]: E[K];
  } & {
    ref?: React.LegacyRef<T>;
    key?: React.Key;
  };
}

declare module 'react-router-dom' {
  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
    children?: React.ReactNode;
  }

  export const BrowserRouter: React.FC<{ children?: React.ReactNode }>;
  export const Route: React.FC<RouteProps>;
  export const Routes: React.FC<{ children?: React.ReactNode }>;
  export const Link: React.FC<{ to: string; children?: React.ReactNode; className?: string }>;
  export const Outlet: React.FC;
  export function useNavigate(): (to: string) => void;
  export function useLocation(): { pathname: string; search: string; hash: string };
}