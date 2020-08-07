import React from 'react';
import { useParams } from 'react-router-dom';

const user = () => {
  const { id } = useParams();
  return (
    <div className="col">
      USER{id}
    </div>
  );
};

export default user;
