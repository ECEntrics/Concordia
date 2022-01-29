// Modified version of https://github.com/trufflesuite/drizzle/blob/develop/packages/react-plugin/src/DrizzleContext.js
import React from 'react';

const Context = React.createContext();

class Provider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drizzleState: null,
      drizzleInitialized: false,
      breezeState: null,
      breezeInitialized: false,
    };
  }

  componentDidMount() {
    const { drizzle, breeze } = this.props;
    // subscribe to changes in the store, keep state up-to-date
    this.unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState();
      const breezeState = breeze.store.getState();

      if (drizzleState.drizzleStatus.initialized) {
        this.setState({
          drizzleState,
          drizzleInitialized: true,
        });
      }
      if (breezeState.breezeStatus.initialized) {
        this.setState({
          breezeState,
          breezeInitialized: true,
        });
      }
    });

    this.unsubscribe = breeze.store.subscribe(() => {
      const breezeState = breeze.store.getState();
      if (breezeState.breezeStatus.initialized) {
        this.setState({
          breezeState,
          breezeInitialized: true,
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {
      drizzleState, drizzleInitialized, breezeState, breezeInitialized,
    } = this.state;
    const { drizzle, breeze, children } = this.props;

    return (
        <Context.Provider
          value={{
            drizzle,
            drizzleState,
            drizzleInitialized,
            breeze,
            breezeState,
            breezeInitialized,
          }}
        >
            {children}
        </Context.Provider>
    );
  }
}

export default {
  Context,
  Consumer: Context.Consumer,
  Provider,
};
