import React from 'react';
import PropTypes from 'prop-types';

const Table = (props) => {
  const { columnNames, children, className } = props;

  return (
    <table className={`table m-0 table-text ${className}`}>
      <thead className="bg-light small text-uppercase text-muted bold">
        <tr>
          {columnNames.map((columnName, key) => (
            <th key={key}>{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

Table.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  columnNames: PropTypes.array,
};

export default Table;
