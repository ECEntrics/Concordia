import React from "react";
import { AccountData, ContractData } from "drizzle-react-components";

export default ({ accounts }) => (
  <div className="App">
      <div className="section">
          <h1>Active Account</h1>
          <AccountData accountIndex="0" units="ether" precision="3" />
      </div>
      <div className="section">
          <h1>Has user signed up?</h1>
          <p>
              <ContractData contract="Forum" method="hasUserSignedUp" methodArgs={[accounts[0],{from: accounts[0]}]} />
          </p>
      </div>
  </div>
);
