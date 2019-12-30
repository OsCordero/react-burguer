import React, { Suspense } from 'react';
import Burguer from './components/Burguer/Burguer';
import HeaderTitle from './components/HeaderTitle/HeaderTitle';
import ButtonPanel from './components/ButtonPanel/ButtonPanel';
import SuccessMessage from './components/messages/SuccessMessage.js';
import { getNewConversionValue } from './helpers/currencyStateHandler';
import SideBar from './components/SideBar/SideBar';
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
    isMessageShow: false,
    ingredientHistory: [],
  };

  loadHistory = data => {
    this.setState({ ingredientHistory: data });
  };

  saveBurger = async () => {
    const { quantities, ingredients, total, currency } = this.state;

    const response = await jsonServer.post('/burguers', {
      quantities,
      ingredients,
      total,
      currency,
    });
    if (response.status >= 200 && response.status < 300) {
      this.setState({ isSuccess: true, isMessageShow: true });

      setTimeout(() => {
        this.setState({ isMessageShow: false });
      }, 2000);
      setTimeout(() => {
        this.setState({ isSuccess: false });
      }, 2600);
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

  async onCurrencyChange(newCurrency) {
    const { ingredientsPrices, currency, quantities } = this.state;
    const conversion = getNewConversionValue(currency.currency, newCurrency);

    const newChange = currency.change * conversion;

    Object.keys(ingredientsPrices).forEach(ingredient => {
      ingredientsPrices[ingredient] = +(
        ingredientsPrices[ingredient] * conversion
      ).toFixed(2);
    });

    await this.setState({
      currency: { currency: newCurrency, change: +newChange.toFixed(2) },
      ingredientsPrices,
    });

    const total = await this.calculateTotal(
      Object.keys(quantities),
      quantities
    );
    this.setState({ total });
  }

  onIngredientAdd = (quantities, ingredients) => {
    const ingredientsKeys = Object.keys(quantities);
    const total = this.calculateTotal(ingredientsKeys, quantities);
    this.setState({ ingredients, quantities, total });
  };

  onIngredientRemove = removed => {
    const { ingredients, quantities } = this.state;
    const ingredientsBeforeRemove = ingredients.reverse();
    let total = 1.0;
    if (ingredientsBeforeRemove.indexOf(removed) >= 0) {
      ingredientsBeforeRemove.splice(
        ingredientsBeforeRemove.indexOf(removed),
        1
      );
      const quantitiesBeforeRemove = quantities;
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
      currency,
      isSuccess,
      isMessageShow,
      ingredientHistory,
    } = this.state;
    return (
      <div className="App">
        <HeaderTitle></HeaderTitle>

        <SideBar loadHistory={this.loadHistory}>
          {ingredientHistory.map(
            (ingredients => <Burguer ingredients={ingredients} />: null)
          )}
        </SideBar>
        {isSuccess && (
          <SuccessMessage
            shouldShow={
              isMessageShow ? 'animated fadeInDown' : 'animated fadeOut'
            }
          />
        )}
        <div className="content">
          <div className="panel">
            <ButtonPanel
              buttons={ingredientsPrices}
              onIngredientAdd={this.onIngredientAdd}
              currency={currency.currency}
            />
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
            <Suspense fallback={<div>Loading...</div>}>
              {Object.keys(quantities).length >= 1 && (
                <Bill
                  onIngredientRemove={this.onIngredientRemove}
                  ingredientsBill={quantities}
                  ingredientsPrices={ingredientsPrices}
                  currency={currency.currency}
                  total={total}
                />
              )}
            </Suspense>
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
