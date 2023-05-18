import { createAsyncThunk } from '@reduxjs/toolkit';
import { Pizza, SearchPizzaParams } from 'redux/pizza/types';
import axios from 'axios';

export const fetchPizzas = createAsyncThunk<Pizza[], SearchPizzaParams>('pizza/fetchPizzasStatus', async (params) => {
  const { sortBy, order, category, search, currentPage } = params;
  const { data } = await axios.get<Pizza[]>(
    `https://643f8896b9e6d064bef7b69c.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`
  );
  return data;
});