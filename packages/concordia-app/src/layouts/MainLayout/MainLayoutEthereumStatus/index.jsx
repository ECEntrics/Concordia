import React from 'react';
import { useSelector } from 'react-redux';
import StatusSegment from '../../../components/Status/StatusSegment';
import StatusKeyRow from '../../../components/Status/StatusKeyRow';
import StatusValueRow from '../../../components/Status/StatusValueRow';

import ethereumLogo from '../../../assets/images/ethereum_logo.svg';

const MainLayoutEthereumStatus = () => {
  const userAddress = useSelector((state) => state.user.address);
  const blockNumber = useSelector((state) => state.currentBlock.number);
  const blockHash = useSelector((state) => state.currentBlock.hash);

  return (
      <StatusSegment
        headerTitle="Ethereum Status"
        headerImage={ethereumLogo}
      >
          <StatusKeyRow value="User Address" />
          <StatusValueRow value={userAddress} />
          <StatusKeyRow value="Block Number" />
          <StatusValueRow value={blockNumber} />
          <StatusKeyRow value="Block Hash" />
          <StatusValueRow value={blockHash} />
      </StatusSegment>
  );
};

export default MainLayoutEthereumStatus;
