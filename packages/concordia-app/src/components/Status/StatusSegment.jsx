import React from 'react';
import {
  Header, Image, Segment, Table,
} from 'semantic-ui-react';
import './styles.css';

const StatusKeyRow = (props) => {
  const { headerTitle, headerImage, children } = props;
  return (
      <Segment padded>
          <Header textAlign="center">
              <Image src={headerImage} size="small" />
              {headerTitle}
          </Header>
          <Table className="status-table" compact textAlign="center" columns={1}>
              <Table.Body>
                  {children}
              </Table.Body>
          </Table>
      </Segment>
  );
};

export default StatusKeyRow;
