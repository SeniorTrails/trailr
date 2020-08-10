import React from 'react';

/**
 * input: An input component that displays a label and an input field
 *  type will default to 'text' but if it is 'select' you must provide
 *  an options array that is made of objects with a value and a label
 * @param {Object} props value, changeHandler, name, label, type, options
 * @returns {JSX} label and input
 */
const input = ({ value = '', changeHandler, name, label, type = 'text', options }) => {
  let component = null;

  switch (type) {
    case 'select':
      component = (
        <select onChange={changeHandler} name={name} value={value}>
          {options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      );
      break;
    case 'text':
    default:
      component = <input name={name} type="text" value={value} onChange={changeHandler} />;
  }

  return (
    <div style={{ display: 'inline' }}>
      <label>
        {label}
        {component}
      </label>
    </div>
  );
};

export default input;
