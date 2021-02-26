import './utils/indexedDB/patchIndexedDB';
import './utils/wdyr';
import React, { Suspense } from 'react';
import { render } from 'react-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import store from './redux/store';
import * as serviceWorker from './utils/serviceWorker';
import LoadingScreen from './components/LoadingScreen';
import './assets/css/index.css';

render(
    <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
            <App store={store} />
        </Suspense>
    </ErrorBoundary>,
    document.getElementById('root'),
);

serviceWorker.unregister(); // See also: http://bit.ly/CRA-PWA
