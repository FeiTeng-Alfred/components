import {
    TypeCreditCard, CreditCardType, FormFieldName, TypeFormErrors,
    TypeCreditCardGuard
} from "./creditCardTypes";

export const MAXIMUM_CREDIT_CARD_EXP_YEAR = 2100;
export const ALLOWED_CREDIT_CARDS = [CreditCardType.AMEX, CreditCardType.VISA];

export const CREDIT_CARD_VALIDATION = {
    [CreditCardType.AMEX]: {
        idDigitNumbers: ['34', '37'],
        validLength: 15,
        groupFormat: [[0, 4], [4, 10], [10, 15]],
        cvv2: 4,
    },
    [CreditCardType.VISA]: {
        idDigitNumbers: ['4'],
        validLength: 16,
        groupFormat: [[0, 4], [4, 8], [8, 12], [12, 16]],
        cvv2: 3,
    }
};

export const getCreditCardGuard = (creditCardNumber: string): TypeCreditCardGuard => {
    const cNum = getFormattedCardNumber(creditCardNumber);

    if (cNum.length < 2) {
        return {
            cardType: 'unknown',
            validLength: 0,
            groupFormat: [],
            cvv2: 0,
        };
    }

    for (const cardType of Object.keys(CREDIT_CARD_VALIDATION)) {
        const {idDigitNumbers, validLength, groupFormat, cvv2} = CREDIT_CARD_VALIDATION[cardType];
        const foundMatch = idDigitNumbers.find((n) => creditCardNumber.startsWith(n)) !== undefined;

        if (foundMatch) {
            return {
                cardType,
                validLength,
                groupFormat,
                cvv2
            }
        }
    }

    return {
        cardType: 'invalid',
        validLength: 0,
        groupFormat: [],
        cvv2: 0,
    };
};

export const getIsValidCreditCardNumber = (creditCardTypes: CreditCardType[], creditCardNumber: string) => {
    const cNum = getFormattedCardNumber(creditCardNumber);
    const guard = getCreditCardGuard(cNum);

    if (!(creditCardTypes as string[]).includes(guard.cardType)) {
        return false;
    }

    return cNum.length === guard.validLength;
};

export const getFormattedCardNumber = (cardNumber: string) => {
    return cardNumber.trim().split(' ').join('');
};

export const getFormattedCardInfo = (creditCard: TypeCreditCard) => {
    return {
        [FormFieldName.NAME]: creditCard[FormFieldName.NAME].trim(),
        [FormFieldName.NUMBER]: getFormattedCardNumber(creditCard[FormFieldName.NUMBER]),
        [FormFieldName.CVV2]: creditCard[FormFieldName.CVV2].trim(),
        [FormFieldName.EXP_MONTH]: creditCard[FormFieldName.EXP_MONTH].trim(),
        [FormFieldName.EXP_YEAR]: creditCard[FormFieldName.EXP_YEAR].trim(),
    }
};

export const getIsValidCvv2 = (cvv2: string, creditCardGuard: TypeCreditCardGuard) => {
    return cvv2.length === creditCardGuard.cvv2;
};

export const getIsValidExpMonth = (month: string, year: string, now: Date) => {
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const inputMonth = Number(month);
    const inputYear = Number(year);

    return (inputMonth >= 0 && inputMonth < 12) && (inputYear > currentYear || (inputYear === currentYear && inputMonth > currentMonth))
};

export const getIsValidExpYear = (year: string, now: Date) => {
    const currentYear = now.getFullYear();
    const inputYear = Number(year);

    return inputYear >= currentYear && inputYear <= MAXIMUM_CREDIT_CARD_EXP_YEAR;
};
