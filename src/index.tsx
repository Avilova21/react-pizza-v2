import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";

import App from './App';

import {store} from "./redux/store";
import { createRoot } from 'react-dom/client';

const rootElem = document.getElementById('root')

if(rootElem) {
	const root = createRoot(rootElem);
	root.render(
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>
	);
}


