import React, { useMemo } from 'react';
import { Icon, Pagination } from 'semantic-ui-react';

export const ITEMS_PER_PAGE = 10;

const PaginationComponent = (props) => {
  const { numberOfItems, onPageChange } = props;
  return useMemo(() => (
      <Pagination
        defaultActivePage={1}
        ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
        firstItem={{ content: <Icon name="angle double left" />, icon: true }}
        lastItem={{ content: <Icon name="angle double right" />, icon: true }}
        prevItem={{ content: <Icon name="angle left" />, icon: true }}
        nextItem={{ content: <Icon name="angle right" />, icon: true }}
        totalPages={Math.ceil(numberOfItems / ITEMS_PER_PAGE)}
        disabled={numberOfItems <= ITEMS_PER_PAGE}
        onPageChange={onPageChange}
      />
  ), [numberOfItems, onPageChange]);
};

export default PaginationComponent;
