import React from 'react';
import useForm from '../helpers';
import Input from './input.jsx';

const commentSubmit = ({ text }) => {
  console.log(text);
};

const addComment = () => {
  const { values, changeHandler, submitHandler } = useForm(commentSubmit);

  return (
    <div>
      <Input value={values.text} changeHandler={changeHandler} label="New Comment" name="text" />
      <button onClick={submitHandler}>Add New Comment</button>
    </div>
  );
};

export default addComment;
