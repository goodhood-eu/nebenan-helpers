import React, { PureComponent } from 'react';
import { connect } from 'react-redux';


export default (mapStateToProps, mapDispatchToProps, mergeProps, opts) => {
  const options = { ...opts, withRef: true };

  const connectFunc = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options,
  );

  return (methods, WrappedComponent) => {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    const ConnectedComponent = connectFunc(WrappedComponent);
    const componentMethods = {};

    const getMethod = (method) => (
      function(...args) {
        return this.proxiedInstance[method].call(this.proxiedInstance, ...args);
      }
    );

    class Proxy extends PureComponent {
      componentDidMount() {
        this.proxiedInstance = this.proxiedRef.getWrappedInstance();
      }

      getWrappedInstance() {
        return this.proxiedInstance;
      }

      render() {
        return <ConnectedComponent {...this.props} ref={(el) => { this.proxiedRef = el; }} />;
      }
    }

    Proxy.displayName = `ProxyConnect(${displayName})`;
    Proxy.WrappedComponent = ConnectedComponent;

    methods.forEach((method) => { componentMethods[method] = getMethod(method); });
    Object.assign(Proxy.prototype, componentMethods);

    return Proxy;
  };
};
