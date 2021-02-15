import type {} from 'styled-components/cssprop';
import React from 'react';
import {CreditCardBox} from "./components/creditCardBox/CreditCardBox";
import {ALLOWED_CREDIT_CARDS} from "./components/creditCardBox/creditCardHelpers";

function App() {
  return (
    <div css="width: 500px; margin: 20px auto;">
      <CreditCardBox creditCardTypes={ALLOWED_CREDIT_CARDS} onSave={()=>{}}/>
    </div>
  );
}

export default App;
