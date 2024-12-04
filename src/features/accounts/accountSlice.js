import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	balance: 0,
	loan: 0,
	loanPurpose: '',
	isLoading: false,
}

const accountSlice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		deposit(state, action) {
			state.balance += action.payload;
			state.isLoading = false;
		},
		withdraw(state, action) {
			state.balance -= action.payload;
		},
		requestLoan: {
			prepare(amount, purpose) {
				return {
					payload: { amount, purpose }
				}
			},
			reducer(state, action) {
				if (state.loan > 0) return;

				state.balance += action.payload.amount;
				state.loan = action.payload.amount;
				state.loanPurpose = action.payload.purpose;
			}
		},
		payLoan(state, action) {
			state.balance -= state.loan;
			state.loanPurpose = '';
			state.loan = 0;
		},
		convertingCurrency(state, action) {
			state.isLoading = true;
		}
	}
});

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;
export default accountSlice.reducer;

export function deposit(amount, currency) {
	if (currency === 'USD') return { type: 'account/deposit', payload: amount };

	return async function (dispatch, getState) {
		dispatch({ type: 'account/convertingCurrency' });
		const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`)
		const data = await res.json();
		const converted = data.rates.USD;
		console.log(converted);
		dispatch({ type: 'account/deposit', payload: converted });
	}
};

