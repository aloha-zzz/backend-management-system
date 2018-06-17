import React from 'react';
import ReactDOM from 'react-dom';
import Frame from './component/router';
import { HashRouter } from 'react-router-dom'




ReactDOM.render(
    <HashRouter>
        <Frame />
    </HashRouter>
    , document.getElementById('main')); // browserRouter 会有问题。待解决