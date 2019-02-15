import HomeComponent from "../components/HomeComponent";
import { drizzleConnect } from "drizzle-react";

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Forum: state.contracts.Forum,
    drizzleStatus: state.drizzleStatus
  };
};

const HomeContainer = drizzleConnect(HomeComponent, mapStateToProps);

export default HomeContainer;
