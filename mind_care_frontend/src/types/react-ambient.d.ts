declare module 'react' {
  import * as React from 'react';
  
  export = React;
  export as namespace React;

  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<any, any>);
  
  interface Component<P = {}, S = {}> {
    render(): ReactElement<any, any> | null;
    props: Readonly<P>;
    state: Readonly<S>;
    setState(state: S): void;
  }

  type Key = string | number;
  type FC<P = {}> = FunctionComponent<P>;

  interface FunctionComponent<P = {}> {
    (props: P): ReactElement<any, any> | null;
    propTypes?: any;
    contextTypes?: any;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;
  interface ReactFragment { }
  interface ReactPortal extends ReactElement { }

  interface Attributes {
    key?: Key;
  }

  interface ClassAttributes<T> extends Attributes {
    ref?: React.Ref<T>;
  }

  type Ref<T> = ((instance: T | null) => void) | React.RefObject<T> | null;
  interface RefObject<T> {
    readonly current: T | null;
  }
}

declare module 'react-dom' {
  import * as ReactDOM from 'react-dom';
  
  export = ReactDOM;
  export as namespace ReactDOM;
}

declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  interface ElementClass extends React.Component<any> {}
  interface ElementAttributesProperty { props: {}; }
  interface ElementChildrenAttribute { children: {}; }
  interface IntrinsicAttributes extends React.Attributes {}
  interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}