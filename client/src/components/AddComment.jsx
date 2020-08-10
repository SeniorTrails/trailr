import React from 'react';
import useForm from '../helpers';
import Input from './input.jsx';

const addComment = ({ appendComments }) => {
  const commentSubmit = ({ text }) => {
    console.log(text);
    appendComments({ text, id: text[0], username: 'Danny' });
  };

  const { values, changeHandler, submitHandler } = useForm(commentSubmit);

  return (
    <div>
      <Input value={values.text} changeHandler={changeHandler} label="" name="text" type="textarea" />
      <button type="button" className="btn btn-primary" onClick={submitHandler}>Add New Comment</button>
    </div>
  );
};

export default addComment;
