/**
 * Higher Order Components
 * - Enhancers: 추가적인 기능이나 property를 가지고 컴포넌트를 감싸는 것.
 * - Injector: 컴포넌트에 Property를 주입하는 것.
 */

type PageInfo = {};

// Enhancer
export const withPageInfo = <P extends object>(
  options: PageInfo,
  WrappedComponent: React.ComponentType<P>,
) => {
  return (props: P) => {
    return <WrappedComponent {...props} />;
  };
};
