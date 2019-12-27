import React, { Component } from 'react';
import './burguer.css';
import TopBun from '../TopBun/TopBun';
import BottomBun from '../BottomBun/BottomBun';
import Meat from '../Meat/Meat';
import Tomato from '../Tomato/Tomato';
import Salad from '../Salad/Salad';
import Cheese from '../Cheese/Cheese';
import Onion from '../Onion/Onion';
export default class Burguer extends Component {
  // eslint-disable-next-line no-unused-vars
  render(props) {
    const ingredients = this.props.ingredients;
    return (
      <div className="burguer-container">
        <div className="burguer">
          <TopBun />
          {ingredients.map((ingredient, index) => {
            switch (ingredient) {
              case 'tomato':
                return <Tomato key={index} className="ingredient" />;
              case 'onion':
                return <Onion key={index} className="ingredient" />;
              case 'cheese':
                return <Cheese key={index} className="ingredient" />;
              case 'salad':
                return <Salad key={index} className="ingredient" />;
              case 'meat':
                return <Meat key={index} className="ingredient" />;
              default:
                return null;
            }
          })}
          <BottomBun />
        </div>
      </div>
    );
  }
}
