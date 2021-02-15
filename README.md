# Getting Started with Components Playground

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Compinents List
### CreditCardBox
Api: 
1. creditCardTypes - allowed credit card types
2. onSave - callback that will triggered when successfully save the card

More about creditCardHelper:

1.use ALLOWED_CREDIT_CARDS to store allowed credit card types

2.use CREDIT_CARD_VALIDATION to store validation rules on card type 
```json
{
    "idDigitNumbers": "list of card prefix number",
    "validLength": "required card length",
    "groupFormat": "a list of [start end] to group card number",
    "cvv2": "required cvv2 length",
}
```

## How to start
1. Clone to local
2. cd {dir}/components_playground
3. run `yarn`
4. run `yarn start`
5. go http://localhost:3000/

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

