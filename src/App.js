import React, { Suspense } from 'react';
import Burguer from './components/Burguer/Burguer';
import HeaderTitle from './components/HeaderTitle/HeaderTitle';
import ButtonPanel from './components/ButtonPanel/ButtonPanel';
import SuccessMessage from './components/messages/SuccessMessage.js';
import jsonServer from './api/json-server';
import './App.css';
const Bill = React.lazy(() => import('./components/Bill/Bill'));
class App extends React.Component {
  state = {
    quantities: {},
    ingredients: [],
    ingredientsPrices: {
      meat: 1.5,
      salad: 0.25,
      tomato: 0.5,
      onion: 0.2,
      cheese: 0.5,
    },
    total: 1.0,
    currency: {
      currency: 'USD',
      change: 1.0,
    },
    isSuccess: false,
  };

  saveBurger = async () => {
    const { quantities, ingredients, total } = this.state;

    const response = await jsonServer.post('/burguers', {
      quantities,
      ingredients,
      total,
    });
    if (response.status >= 200 && response.status < 300) {
      this.setState({ isSuccess: true });
      setTimeout(() => {
        this.setState({ isSuccess: false });
      }, 2000);
    }
  };

  calculateTotal(ingredientsKeys, quantities) {
    const { ingredientsPrices } = { ...this.state };
    let total = this.state.currency.change;

    ingredientsKeys.forEach(ingredient => {
      total += quantities[ingredient] * ingredientsPrices[ingredient];
    });
    return total;
  }

  onCurrencyChange(newCurrency) {
    const { ingredientsPrices } = this.state;
    let newPrices = [];
    switch (newCurrency) {
      case 'USD':
        this.setState({ currency: { currency: 'USD', change: 1.0 } });
        newPrices = Object.keys(ingredientsPrices).map(ingredient => {
          return (ingredientsPrices[ingredient] *= 1.0).toFixed(2);
        });
        break;
      case 'EUR':
        this.setState({ currency: { currency: 'EUR', change: 0.9 } });
        newPrices = Object.keys(ingredientsPrices).map(ingredient => {
          return (ingredientsPrices[ingredient] *= 0.9).toFixed(2);
        });
        break;
      case 'GTQ':
        this.setState({ currency: { currency: 'GTQ', change: 7.7 } });
        newPrices = Object.keys(ingredientsPrices).map(ingredient => {
          return (ingredientsPrices[ingredient] *= 7.7).toFixed(2);
        });
        break;
      default:
        break;
    }
    const total = this.calculateTotal(
      Object.keys(this.state.quantities),
      this.state.quantities
    );
    this.setState({ ingredientsPrices: ingredientsPrices, total });
  }

  onIngredientAdd = (quantities, ingredients) => {
    const ingredientsKeys = Object.keys(quantities);
    const total = this.calculateTotal(ingredientsKeys, quantities);
    this.setState({ ingredients, quantities, total });
  };

  onIngredientRemove = removed => {
    const ingredientsBeforeRemove = this.state.ingredients.reverse();
    let total = 1.0;
    if (ingredientsBeforeRemove.indexOf(removed) >= 0) {
      ingredientsBeforeRemove.splice(
        ingredientsBeforeRemove.indexOf(removed),
        1
      );
      const quantitiesBeforeRemove = this.state.quantities;
      quantitiesBeforeRemove[removed] -= 1;
      const ingredientsKeys = Object.keys(quantitiesBeforeRemove);
      total = this.calculateTotal(ingredientsKeys, quantitiesBeforeRemove);
      this.setState({ ingredients: ingredientsBeforeRemove.reverse(), total });
    }
  };
  render() {
    const {
      quantities,
      ingredients,
      ingredientsPrices,
      total,
      isSuccess,
    } = this.state;
    return (
      <div className="App">
        <HeaderTitle></HeaderTitle>
        {isSuccess && <SuccessMessage />}
        <div className="content">
          <div className="panel">
            <ButtonPanel
              buttons={ingredientsPrices}
              onIngredientAdd={this.onIngredientAdd}
            />
            <Suspense fallback={<div>Loading...</div>}>
              {Object.keys(this.state.quantities).length >= 1 && (
                <Bill
                  onIngredientRemove={this.onIngredientRemove}
                  ingredientsBill={quantities}
                  ingredientsPrices={ingredientsPrices}
                  total={total}
                />
              )}
            </Suspense>
            <div className="currency-select">
              <label htmlFor="currency">Currency type: </label>
              <select
                name="currency"
                id=""
                onChange={e => this.onCurrencyChange(e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="GTQ">GTQ</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
          <div className="burguer-side">
            <button className="save-burguer" onClick={this.saveBurger}>
              Save my burguer!
            </button>
            <Burguer ingredients={ingredients} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
