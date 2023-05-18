import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "redux/filter/slice";
import cart from "redux/cart/slice";
import pizza from 'redux/pizza/slice'
import { useDispatch } from 'react-redux';

export const store = configureStore({
	reducer: {
		filterSlice,
		cart,
		pizza,
	},
});

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()