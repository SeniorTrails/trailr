import React from 'react';
import PropTypes from 'prop-types';

/**
 * input: An input component that displays a label and an input field
 *  type will default to 'text' but if it is 'select' you must provide
 *  an options array that is made of objects with a value and a label
 * @param {(Number|String)} value value for the input component
 * @param {Function} changeHandler function that handles changes
 * @param {String} name unique name of the value
 * @param {String} label label to be displayed
 * @param {String} type defaults to text, type of input component
 * @param {Array} options optional, for a select component array of {value, label}
 */
const input = ({
  value = '',
  changeHandler,
  name,
  label,
  type = 'text',
  options,
  style,
}) => {
  let component = null;

  switch (type) {
    case 'select':
      component = (
        <select id={name} onChange={changeHandler} name={name} value={value}>
          {options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      );
      break;
    case 'textarea':
      component = <textarea id={name} name={name} value={value} onChange={changeHandler} rows="4" cols="30" />;
      break;
    case 'text':
    default:
      component = <input id={name} name={name} type="text" value={value} onChange={changeHandler} />;
  }

  return (
    <div style={style}>
      <label htmlFor={name}>{label}
        {component}
      </label>
    </div>
  );
};

export default input;

input.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  changeHandler: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOf([
        PropTypes.number,
        PropTypes.string,
      ]),
      label: PropTypes.string,
    }),
  ),
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};
