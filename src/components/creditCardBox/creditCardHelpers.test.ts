import {
    CREDIT_CARD_VALIDATION,
    getIsValidCreditCardNumber,
    getIsValidCvv2,
    getIsValidExpMonth, getIsValidExpYear,
    MAXIMUM_CREDIT_CARD_EXP_YEAR
} from './creditCardHelpers';
import {CreditCardType} from "./creditCardTypes";

describe('#getIsValidCreditCardNumber()', function () {
  describe.each([
      ['', [CreditCardType.AMEX, CreditCardType.VISA], false],
      ['37', [CreditCardType.AMEX, CreditCardType.VISA], false],
      ['34', [CreditCardType.AMEX, CreditCardType.VISA], false],
      ['4', [CreditCardType.AMEX, CreditCardType.VISA], false],
      ['3705', [CreditCardType.AMEX, CreditCardType.VISA], false],
      ['3412', [CreditCardType.AMEX, CreditCardType.VISA], false],
      ['4444', [CreditCardType.AMEX, CreditCardType.VISA], false],
      ['4444 4444 4444 4444', [CreditCardType.AMEX, CreditCardType.VISA], true],
      ['4444444444444444', [CreditCardType.AMEX, CreditCardType.VISA], true],
      ['3705 123456 12345', [CreditCardType.AMEX, CreditCardType.VISA], true],
      ['370512345612345', [CreditCardType.AMEX, CreditCardType.VISA], true],
      ['340512345612345', [CreditCardType.AMEX, CreditCardType.VISA], true],
      ['3405 123456 12345', [CreditCardType.AMEX, CreditCardType.VISA], true],
      ['4444 4444 4444 4444', [CreditCardType.AMEX], false],
      ['3705 123456 12345', [CreditCardType.VISA], false],
  ])(
      'When card number is %s and allowed card is %s', (number, creditCardTypes, expected) => {
        it(`should return ${expected}`, () => {
          expect(getIsValidCreditCardNumber(creditCardTypes, number)).toEqual(expected)
        });
      }
  );
});

describe('#getIsValidCvv2()', function () {
  describe.each([
      ['123', CREDIT_CARD_VALIDATION[CreditCardType.AMEX], false],
      ['1234', CREDIT_CARD_VALIDATION[CreditCardType.AMEX], true],
      ['123', CREDIT_CARD_VALIDATION[CreditCardType.VISA], true],
      ['1234', CREDIT_CARD_VALIDATION[CreditCardType.VISA], false],
  ])(
      'When input cvv2 is %s and guard is %s', (cvv2, creditCardGuard, expected) => {
        it(`should return ${expected}`, () => {
          expect(getIsValidCvv2(cvv2, creditCardGuard)).toEqual(expected)
        });
      }
  );
});

describe('#getIsValidExpMonth()', () => {
    const now = new Date(Date.parse('2020/02/01'));

    describe.each([
      [{month: '3', year: '2020', now,}, true],
      [{month: '1', year: '2020', now,}, false],
      [{month: '5', year: '2019', now,}, false],
      [{month: '1', year: '2021', now,}, true],
      [{month: '13', year: '2021', now,}, false],
      [{month: '-1', year: '2021', now,}, false],
      [{month: '1', year: String(MAXIMUM_CREDIT_CARD_EXP_YEAR + 1), now,}, true],
      [{month: '1', year: String(MAXIMUM_CREDIT_CARD_EXP_YEAR), now,}, true],
  ])(
      'When input is %o', (params, expected) => {
        it(`should return ${expected}`, () => {
          expect(getIsValidExpMonth(params.month, params.year, params.now)).toEqual(expected)
        });
      }
  );
});

describe('#getIsValidExpYear()', () => {
    const now = new Date(Date.parse('2020/02/01'));

    describe.each([
      [{year: '2020', now,}, true],
      [{year: '2019', now,}, false],
      [{year: String(MAXIMUM_CREDIT_CARD_EXP_YEAR + 1), now}, false],
      [{year: String(MAXIMUM_CREDIT_CARD_EXP_YEAR), now}, true],
  ])(
      'When input is %o', (params, expected) => {
        it(`should return ${expected}`, () => {
          expect(getIsValidExpYear(params.year, params.now)).toEqual(expected)
        });
      }
  );
});