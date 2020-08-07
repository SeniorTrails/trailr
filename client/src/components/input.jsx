import React from 'react';

/**
 * input: An input component that displays a label and an input field
 * @param {Object} props value, changeHandler, name, label
 * @returns {JSX} label and input
 */
const input = ({ value, changeHandler, name, label }) => {
  value = value || '';
  
  return (
    <div>
      <label>{label}
        <input name={name} type="text" value={value} onChange={changeHandler} />
      </label>
    </div>
    );
}

export default input;
