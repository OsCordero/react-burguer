import React, { Component } from 'react';
import './buttonpanel.css';
export default class ButtonPanel extends Component {
  state = { buttons: {}, ingredients: [] };

  onButtonClick = e => {
    const auxButtons = this.state.buttons;
    const auxIngredients = this.state.ingredients;
    auxIngredients.push(e.target.value);

    auxButtons[e.target.value]
      ? (auxButtons[e.target.value] += 1)
      : (auxButtons[e.target.value] = 1);
    this.setState({ buttons: auxButtons, ingredients: auxIngredients });
    this.props.onIngredientAdd(auxButtons, auxIngredients);
  };

  fortmatCurrency(currency, total) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    });

    return formatter.format(total);
  }

  // eslint-disable-next-line no-unused-vars
  render(props) {
    const { buttons, currency } = this.props;

    return (
      <div className="button-panel">
        {Object.keys(buttons).map((button, index) => (
          <button
            className="ingredient-btn"
            value={button}
            key={index}
            onClick={this.onButtonClick}
          >
            Add {button} - ({this.fortmatCurrency(currency, buttons[button])} )
          </button>
        ))}
      </div>
    );
  }
}
