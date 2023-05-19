import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'redux/store';
import qs from 'qs';

import { Skeleton, PizzaBlock, Categories, Pagination, SortPopup } from 'components';


import { setCategoryId, setCurrentPage, setFilters } from 'redux/filter/slice';
import { selectFilter } from 'redux/filter/selectors'
import { sortList } from 'components/Sort';
import { selectPizzaData } from 'redux/pizza/selectors';
import { fetchPizzas } from 'redux/pizza/asyncActions';
import { SearchPizzaParams } from 'redux/pizza/types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const { items, status } = useSelector(selectPizzaData)
  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);

  const onChangeCategory = useCallback((idx: number) => {
    dispatch(setCategoryId(idx));
  }, []);

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  }

  const getPizzas = () => {
    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      }),
    );

    window.scrollTo(0, 0)
  };

  useEffect(() => {
    if (isMounted.current) {
      const params = {
        categoryId: categoryId > 0 ? categoryId : null,
        sortProperty: sort.sortProperty,
        currentPage,
      };

      const queryString = qs.stringify(params, { skipNulls: true });

      navigate(`/?${queryString}`);
    }

    if (!window.location.search) {
      dispatch(fetchPizzas({} as SearchPizzaParams))
    }
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);


  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;
      const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);
      dispatch(
        setFilters({
          searchValue: params.search,
          categoryId: Number(params.category),
          currentPage: Number(params.currentPage),
          sort: sort || sortList[0],
        }),
      );
    }
    isMounted.current = true;
  }, []);

  useEffect(() => {

    if (!isSearch.current) {
      getPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const pizzas = items.map((obj: any) => (
    <PizzaBlock key={obj.id} {...obj}/>
  ));

  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onChangeCategory}/>
        <SortPopup value={sort}/>
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕</h2>
          <p>
            Неудалось получит пиццы
          </p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
    </div>
  );
};