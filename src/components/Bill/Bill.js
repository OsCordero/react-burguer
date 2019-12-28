import React, { Component } from 'react';
import './bill.css';
export default class Bill extends Component {
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
    const {
      ingredientsBill,
      ingredientsPrices,
      total,
      currency,
      onIngredientRemove,
    } = this.props;

    return (
      <div className="bill">
        <div className="bill-table">
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Unit price</th>
                <th>Quantity</th>
                <th>SubTotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(ingredientsBill).map(
                (ingredient, index) =>
                  ingredientsBill[ingredient] >= 1 && (
                    <tr key={index}>
                      <th>{ingredient}</th>
                      <th>{ingredientsPrices[ingredient]}</th>
                      <th>{ingredientsBill[ingredient]}</th>
                      <th>
                        {(
                          ingredientsPrices[ingredient] *
                          ingredientsBill[ingredient]
                        ).toFixed(2)}
                      </th>
                      <th>
                        <button
                          onClick={() => onIngredientRemove(ingredient)}
                          className="less-btn"
                        >
                          -
                        </button>
                      </th>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
        <h2 className="total-label">
          <span>Total: </span> {this.fortmatCurrency(currency, total)}
        </h2>
      </div>
    );
  }
}
