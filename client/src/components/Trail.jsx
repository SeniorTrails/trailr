import React from 'react';
import { useParams } from 'react-router-dom';

const trail = () => {
  const { id } = useParams();
  return (
    <div className="col">
      TRAIL{id}
    </div>
  );
};

export default trail;
