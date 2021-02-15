import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {fireEvent, render} from '@testing-library/react'
import {CreditCardBox} from "./CreditCardBox";
import {CreditCardType} from "./creditCardTypes";

const onSaveMock = jest.fn();
const ALLOWED_CREDIT_CARDS = [CreditCardType.VISA]

describe('CreditCardBox', () => {
    beforeEach(() => {
        onSaveMock.mockReset();
    });

    it('should disabled submit button initially', () => {
        const view = render(<CreditCardBox creditCardTypes={ALLOWED_CREDIT_CARDS} onSave={onSaveMock}/>);

        expect(view.queryByText('Submit')).toHaveAttribute('disabled');
    });

    describe('When no valid card number filled', () => {
        it('should disable ccv2, exp fields and submit button', () => {
            const view = render(<CreditCardBox creditCardTypes={ALLOWED_CREDIT_CARDS} onSave={onSaveMock}/>);

            fireEvent.change(view.queryByPlaceholderText('Name'), { target: { value: 'Demo' } });
            fireEvent.change(view.queryByPlaceholderText('Card Number'), { target: { value: '4444' } });

            expect(view.queryByPlaceholderText('CVV2')).toHaveAttribute('disabled');
            expect(view.queryByPlaceholderText('Exp.Month - MM')).toHaveAttribute('disabled');
            expect(view.queryByPlaceholderText('Exp.Year - YYYY')).toHaveAttribute('disabled');
            expect(view.queryByText('Submit')).toHaveAttribute('disabled');
        });
    });

    describe('When valid card number filled', () => {
        it('should enable ccv2, exp fields and submit button', () => {
            const view = render(<CreditCardBox creditCardTypes={ALLOWED_CREDIT_CARDS} onSave={onSaveMock}/>);

            fireEvent.change(view.queryByPlaceholderText('Name'), { target: { value: 'Demo' } });
            fireEvent.change(view.queryByPlaceholderText('Card Number'), { target: { value: '4444 4444 4444 4444' } });

            expect(view.queryByPlaceholderText('CVV2')).not.toHaveAttribute('disabled');
            expect(view.queryByPlaceholderText('Exp.Month - MM')).not.toHaveAttribute('disabled');
            expect(view.queryByPlaceholderText('Exp.Year - YYYY')).not.toHaveAttribute('disabled');
            expect(view.queryByText('Submit')).not.toHaveAttribute('disabled');
        });
    });
});