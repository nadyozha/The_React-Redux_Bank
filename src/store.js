import { configureStore } from '@reduxjs/toolkit';
import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";

const store = configureStore({
	reducer: {
		account: accountReducer,
		customer: customerReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
});

export default store;