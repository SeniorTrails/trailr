import React from 'react';
import Input from './input.jsx';
import useForm from '../helpers';

const SearchBox = () => {
  const { values, submitHandler, changeHandler } = useForm(onPlacesChanged);

  const onPlacesChanged = () => {
    console.log(values);
  };
  return (
    <>
      <Input
        value={values.searchQuery}
        label="Search"
        name="searchQuery"
        changeHandler={changeHandler}
      />
    </>
  );
};

export default SearchBox;
