import React from 'react';

export default function CompaniesList({ companies }) {
  const emptyMessage = (
    <p>There s no companies yet</p>
  );

  const companiesList = (
    <p>Companies list</p>
  );

  return (
    <div>
      { companies.length === 0 ? emptyMessage : companiesList }
    </div>
  )
}

CompaniesList.propTypes = {
  companies: React.PropTypes.array.isRequired
}