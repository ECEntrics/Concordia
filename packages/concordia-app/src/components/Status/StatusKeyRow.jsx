import React from 'react';
import { Table } from 'semantic-ui-react';

const StatusKeyRow = (props) => {
  const { value } = props;
  return (
      <Table.Row>
          <Table.Cell className="status-key">{value}</Table.Cell>
      </Table.Row>
  );
};

export default StatusKeyRow;
