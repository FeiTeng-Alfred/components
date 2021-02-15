import React, {useState} from 'react';
import styled from 'styled-components';
import cardIcons from './cardIcons.png'
import {
    getCreditCardGuard, getFormattedCardInfo, getFormattedCardNumber,
    getIsValidCreditCardNumber, getIsValidCvv2, getIsValidExpMonth, getIsValidExpYear,
} from "./creditCardHelpers";
import {CreditCardType, FormFieldName, TypeCreditCard, TypeFormErrors} from "./creditCardTypes";

const CreditCardBoxStyled = styled.div`
    padding: 10px;
    background-color: #EFEFEF;
    border: 1px #A5A5B5 solid;
    border-radius: 5px;
    text-align: center;
`;

const Title = styled.div`
    margin-bottom: 10px;
    font-size: 25px;
    font-weight: bold;
    line-height: 1.25;
    display: block;
`;

const FormStyled = styled.form`
    display: grid;
    grid-gap: 10px;
    grid-template:
            "${FormFieldName.NAME} ${FormFieldName.NAME}"
            "${FormFieldName.NUMBER} ${FormFieldName.NUMBER}"
            "${FormFieldName.CVV2} ${FormFieldName.CVV2}"
            "${FormFieldName.EXP_MONTH} ${FormFieldName.EXP_YEAR}"
            "icons icons"
            "button button";
    
    
    @media only screen and (max-width: 640px) {
      grid-template:
            "${FormFieldName.NAME} ${FormFieldName.NAME}"
            "${FormFieldName.NUMBER} ${FormFieldName.NUMBER}"
            "${FormFieldName.CVV2} ${FormFieldName.CVV2}"
            "${FormFieldName.EXP_MONTH} ${FormFieldName.EXP_MONTH}"
            "${FormFieldName.EXP_YEAR} ${FormFieldName.EXP_YEAR}"
            "icons icons"
            "button button";
    }
`;
const FormField = styled.input`
    border: 1px #A5A5B5 solid;
    border-radius: 5px;
    font-size: 25px;
    width: 100%;
    
    &::placeholder {
        text-align: center;
    }
`;
const SubmitButton = styled.button`
    cursor: pointer;
    padding: 5px 15px;
    background-color: #BFBEFA; 
    color: #FFFFFF;
    border: 2px #A5A5B5 solid;
    border-radius: 5px;
    font-size: 25px;
    
    &:disabled {
        background-color: #A5A5B5;
        cursor: default;
    }
`;

const ErrorMessage = ({name, errors}: {name: FormFieldName, errors: TypeFormErrors}) => {
    return errors[name] !== null ? <div css={`color: red; font-size: 12px; text-align: left;`}>{errors[name]}</div> : null;
};

export const CreditCardBox = ({
    creditCardTypes,
                                  onSave,
}: {
    creditCardTypes: CreditCardType[]
    onSave: (creditCard: TypeCreditCard) => void,
}) => {
    const [formValues, setFormValues] = useState<{[key in FormFieldName]: string}>({
        [FormFieldName.NAME]: '',
        [FormFieldName.NUMBER]: '',
        [FormFieldName.CVV2]: '',
        [FormFieldName.EXP_MONTH]: '',
        [FormFieldName.EXP_YEAR]: '',
    });
    const [formErrors, setFormErrors] = useState<{[key in FormFieldName]: string | null}>({
        [FormFieldName.NAME]: null,
        [FormFieldName.NUMBER]: null,
        [FormFieldName.CVV2]: null,
        [FormFieldName.EXP_MONTH]: null,
        [FormFieldName.EXP_YEAR]: null,
    });
    const [error, setError] = useState<string|null>(null);
    const makeHandleFieldChange = (fieldName: FormFieldName) => (event: React.FormEvent<HTMLInputElement>) => {
        setFormErrors({
            ...formErrors,
            [fieldName]: null,
        });

        setFormValues({
            ...formValues,
            [fieldName]: event.currentTarget.value
        });
    };
    const makeHandleValidateField = (fieldName: FormFieldName) => (event: React.FormEvent<HTMLInputElement>) => {
    };
    const handleNumberChange = (event: React.FormEvent<HTMLInputElement>) => {
        setFormErrors({
            ...formErrors,
            [FormFieldName.NUMBER]: null,
        });

        const input = event.currentTarget.value;
        const last = input.charAt(input.length-1);
        const handleFieldChange = makeHandleFieldChange(FormFieldName.NUMBER);

        if (last === ' ') {
            event.currentTarget.value = input.slice(0, input.length-1);
            return handleFieldChange(event);
        }

        //@ts-ignore
        if (isNaN(last)) {
            return;
        }

        const guard = getCreditCardGuard(event.currentTarget.value);

        if (guard.cardType === 'unknown') {
            return handleFieldChange(event);
        }

        if (guard.cardType === 'invalid') {
            return setFormErrors({
                ...formErrors,
                [FormFieldName.NUMBER]: 'Invalid Card Number! (Amex or Visa only)',
            });
        }

        const cNum = getFormattedCardNumber(input);

        if (cNum.length > guard.validLength) {
            return;
        }

        const transformedInput = guard.groupFormat.map(([start, end]: number[]) => (cNum.slice(start, end))).filter(Boolean).join(' ');

        event.currentTarget.value = transformedInput;

        handleFieldChange(event);
    };

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        //Validation
        const now = new Date(Date.now());
        const errors = {
            [FormFieldName.NAME]: formValues[FormFieldName.NAME].trim().length !== 0 ? null : 'Required!',
            [FormFieldName.CVV2]: getIsValidCvv2(formValues[FormFieldName.CVV2], getCreditCardGuard(formValues[FormFieldName.NUMBER])) ? null : 'Invalid CVV2!',
            [FormFieldName.EXP_MONTH]: getIsValidExpMonth(formValues[FormFieldName.EXP_MONTH], formValues[FormFieldName.EXP_YEAR], now) ? null : 'Invalid Month!',
            [FormFieldName.EXP_YEAR]: getIsValidExpYear(formValues[FormFieldName.EXP_YEAR], now) ? null : 'Invalid Year!',
        };

        if (Object.values(errors).filter(Boolean).length > 0) {
            return setFormErrors({
                ...formErrors,
                ...errors,
            });
        }


        //make an POST xhr.
        const response = await fetch('url', {
            method: 'POST',
            //..headers blah
            body: JSON.stringify(getFormattedCardInfo(formValues)),
        });

        if (response.status === 200) {
            return onSave(formValues);
        }

        //Error handling, log blah
        setError('Failed to save card because of no api specified!')
    };

    return (
        <CreditCardBoxStyled css="background-color: #EFEFEF; border: 1px solid #A5A5B5; padding: 10px">
            <Title>Enter your credit card information</Title>
            <FormStyled onSubmit={handleSubmit}>
                <div css={`grid-area: ${FormFieldName.NAME}`}>
                    <FormField
                        name={FormFieldName.NAME}
                        placeholder="Name"
                        value={formValues.name}
                        type="text"
                        onChange={makeHandleFieldChange(FormFieldName.NAME)}
                        onBlur={makeHandleValidateField(FormFieldName.NAME)}
                    />
                    <ErrorMessage name={FormFieldName.NAME} errors={formErrors}/>
                </div>

                <div css={`grid-area: ${FormFieldName.NUMBER}`}>
                    <FormField
                        name={FormFieldName.NUMBER}
                        placeholder="Card Number"
                        value={formValues.number}
                        type="text"
                        onChange={handleNumberChange}
                        onBlur={makeHandleValidateField(FormFieldName.NUMBER)}
                    />
                    <ErrorMessage name={FormFieldName.NUMBER} errors={formErrors}/>
                </div>
                <div css={`grid-area: ${FormFieldName.CVV2}`}>
                    <FormField
                        name={FormFieldName.CVV2}
                        placeholder="CVV2"
                        value={formValues.cvv2}
                        type="number"
                        min={0}
                        disabled={!getIsValidCreditCardNumber(creditCardTypes, formValues[FormFieldName.NUMBER])}
                        onChange={makeHandleFieldChange(FormFieldName.CVV2)}
                    />
                    <ErrorMessage name={FormFieldName.CVV2} errors={formErrors}/>
                </div>
                <div css={`grid-area: ${FormFieldName.EXP_MONTH}`}>
                    <FormField
                        name={FormFieldName.EXP_MONTH}
                        placeholder="Exp.Month - MM"
                        value={formValues.expMonth}
                        type="number"
                        min={0}
                        disabled={!getIsValidCreditCardNumber(creditCardTypes, formValues[FormFieldName.NUMBER])}
                        onChange={makeHandleFieldChange(FormFieldName.EXP_MONTH)}
                    />
                    <ErrorMessage name={FormFieldName.EXP_MONTH} errors={formErrors}/>
                </div>
                <div css={`grid-area: ${FormFieldName.EXP_YEAR}`}>
                    <FormField
                        name={FormFieldName.EXP_YEAR}
                        placeholder="Exp.Year - YYYY"
                        value={formValues.expYear}
                        type="number"
                        min={0}
                        disabled={!getIsValidCreditCardNumber(creditCardTypes, formValues[FormFieldName.NUMBER])}
                        onChange={makeHandleFieldChange(FormFieldName.EXP_YEAR)}
                    />
                    <ErrorMessage name={FormFieldName.EXP_YEAR} errors={formErrors}/>
                </div>
                <div css="grid-area: icons; text-align: center;">
                    <img src={cardIcons} alt="cardIcons"/>
                </div>
                <div css="grid-area: button; text-align: center;">
                    <SubmitButton
                        disabled={!getIsValidCreditCardNumber(creditCardTypes, formValues[FormFieldName.NUMBER])}
                        type="submit"
                    >
                        Submit
                    </SubmitButton>
                    {error !== null && <div css="color: red;">{error}</div>}
                </div>
            </FormStyled>
        </CreditCardBoxStyled>
    );
};