import React from 'react';
import { Table } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const StatusValueRow = (props) => {
  const { value } = props;
  return (value) ? (
      <Table.Row className="status-value">
          <Table.Cell>
              <CopyToClipboard text={value}>
                  <span>{value}</span>
              </CopyToClipboard>
          </Table.Cell>
      </Table.Row>
  ) : (
      <Table.Row>
          <Table.Cell>-</Table.Cell>
      </Table.Row>
  );
};

export default StatusValueRow;
