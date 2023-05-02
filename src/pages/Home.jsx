import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import qs from "qs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import Skeleton from "../components/Skeleton/Skeleton";
import PizzaBlock from "../components/PizzaBlock";
import Pagination from "../components/Pagination/Pagination";
import { SearchContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryId, setCurrentPage, setFilters } from "../redux/slices/filterSlice";
import { sortList } from "../components/Sort";

const Home = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isSearch = useRef(false);
	const isMounted = useRef(false);

	const { categoryId, sort, currentPage } = useSelector(state => state.filterSlice);

	const { searchValue } = useContext(SearchContext);
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const onChangeCategory = useCallback((idx) => {
		dispatch(setCategoryId(idx));
	}, []);

	const onChangePage = (page) => {
		dispatch(setCurrentPage(page));
	}

	const fetchPizzas = () => {
		setIsLoading(true);

		const sortBy = sort.sortProperty.replace("-", "");
		const order = sort.sortProperty.includes("-") ? "asc" : "desc";
		const category = categoryId > 0 ? `category=${categoryId}` : "";
		const search = searchValue ? `search=${searchValue}` : "";

		axios.get(`https://643f8896b9e6d064bef7b69c.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`)
			.then((res) => {
				setItems(res.data);
				setIsLoading(false);
			});
	};

	useEffect(() => {
		if (isMounted.current) {
			const queryString = qs.stringify({
				sortProperty: sort.sortProperty,
				categoryId,
				currentPage,
			});
			navigate(`?${queryString}`);
		}
		isMounted.current = true;
	}, [categoryId, sort.sortProperty, currentPage]);


	useEffect(() => {
		if (window.location.search) {
			const params = qs.parse(window.location.search.substring(1));

			const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty);

			dispatch(
				setFilters({
					...params,
					sort,
				}),
			);
			isSearch.current = true;
		}
	}, [])

	useEffect(() => {
		window.scrollTo(0, 0)

		if (!isSearch.current) {
			fetchPizzas();
		}

		isSearch.current = false;
	}, [categoryId, sort.sortProperty, searchValue, currentPage]);


	const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj}/>);
	const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>);

	return (
		<div className="container">
			<div className="content__top">
				<Categories value={categoryId} onClickCategory={onChangeCategory}/>
				<Sort value={sort}/>
			</div>
			<h2 className="content__title">Все пиццы</h2>
			<div className="content__items">{isLoading ? skeletons : pizzas}</div>
			<Pagination currentPage={currentPage} onChangePage={onChangePage}/>
		</div>
	);
};

export default Home;