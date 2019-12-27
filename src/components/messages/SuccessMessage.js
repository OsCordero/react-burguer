import React from 'react';
import './succesmessage.css';

export default function SuccessMessage(props) {
  return (
    <div className={`succes ${props.shouldShow}`}>
      Burguer saved succesfuly!
    </div>
  );
}
