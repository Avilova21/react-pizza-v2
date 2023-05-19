import React, { useEffect, useState, FC } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import { useParams, useNavigate } from 'react-router-dom';

type Pizza = {
  imageUrl: string;
  title: string;
  price: number;
}

const FullPizza: FC = () => {
  const [pizza, setPizza] = useState<Pizza>();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get('https://643f8896b9e6d064bef7b69c.mockapi.io/items/' + id);
        setPizza(data);
      } catch (error) {
        alert('Ошибка при получении пиццы!')
        navigate('/');
      }
    }

    fetchPizza();
  }, []);

  if (!pizza) {
    return <>Загрузка...</>;
  }

  return (
    <div className="container">
      <img alt='' src={pizza.imageUrl}/>
      <h2>{pizza.title}</h2>
      <h4>{pizza.price}</h4>
      <Link to="/">
        <button className="button button--outline button--add">
          <span>Назад</span>
        </button>
      </Link>
    </div>
  );
};

export default FullPizza;