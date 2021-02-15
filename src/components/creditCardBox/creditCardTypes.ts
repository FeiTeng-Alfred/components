export enum FormFieldName {
    NAME= 'name',
    NUMBER= 'number',
    CVV2= 'cvv2',
    EXP_MONTH= 'expMonth',
    EXP_YEAR= 'expYear',
}

export type TypeCreditCard = {
    name: string,
    number: string,
    cvv2: string,
    expMonth: string,
    expYear: string,
}

export type TypeFormErrors = {
    name: string | null,
    number: string | null,
    cvv2: string | null,
    expMonth: string | null,
    expYear: string | null,
}

export enum CreditCardType {
    VISA = 'visa',
    AMEX = 'amex',
}

export type TypeCreditCardGuard = {cardType: string, validLength: number, groupFormat: number[][], cvv2: number};