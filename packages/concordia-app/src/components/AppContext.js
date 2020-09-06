// Modified version of https://github.com/trufflesuite/drizzle/blob/develop/packages/react-plugin/src/DrizzleContext.js
import React from "react";

const Context = React.createContext();

class Provider extends React.Component {
    state = {
                drizzleState: null,
                drizzleInitialized: false,
                breezeState: null,
                breezeInitialized: false
    };

    componentDidMount() {
        const { drizzle, breeze } = this.props;
        // subscribe to changes in the store, keep state up-to-date
        this.unsubscribe = drizzle.store.subscribe(() => {
            const drizzleState = drizzle.store.getState();
            const breezeState = breeze.store.getState();

            if (drizzleState.drizzleStatus.initialized) {
                this.setState({
                    drizzleState,
                    drizzleInitialized: true
                });
            }
            if (breezeState.breezeStatus.initialized) {
                this.setState({
                    breezeState: breezeState,
                    breezeInitialized: true
                });
            }
        });

        this.unsubscribe = breeze.store.subscribe(() => {
            const breezeState = breeze.store.getState();
            if (breezeState.breezeStatus.initialized) {
                this.setState({
                    breezeState: breezeState,
                    breezeInitialized: true
                });
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <Context.Provider
                value={{
                    drizzle: this.props.drizzle,
                    drizzleState: this.state.drizzleState,
                    drizzleInitialized: this.state.drizzleInitialized,
                    breeze: this.props.breeze,
                    breezeState: this.state.breezeState,
                    breezeInitialized: this.state.breezeInitialized
                }}
            >
                {this.props.children}
            </Context.Provider>
        );
    }
}

export default {
    Context: Context,
    Consumer: Context.Consumer,
    Provider
};
