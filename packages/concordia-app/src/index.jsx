import './utils/wdyr';
import React, { Suspense } from 'react';
import { render } from 'react-dom';
import App from './App';
import store from './redux/store';
import * as serviceWorker from './utils/serviceWorker';
import LoadingScreen from './components/LoadingScreen';
import './assets/css/index.css';

render(
    <Suspense fallback={<LoadingScreen />}>
        <App store={store} />
    </Suspense>,
    document.getElementById('root'),
);

serviceWorker.unregister(); // See also: http://bit.ly/CRA-PWA
