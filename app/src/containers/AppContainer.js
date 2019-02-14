import AppComponent from "../components/AppComponent";
import { drizzleConnect } from "drizzle-react";

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Forum: state.contracts.Forum,
    drizzleStatus: state.drizzleStatus
  };
};

const AppContainer = drizzleConnect(AppComponent, mapStateToProps);

export default AppContainer;
