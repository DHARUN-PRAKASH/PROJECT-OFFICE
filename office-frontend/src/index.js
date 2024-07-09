import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter } from "react-router-dom";
import Form from './form.js';
import Routing from './routing.js';
import Ftable from "./table";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  <Routing/>
  {/*<BrowserRouter>
    <Cardview />
</BrowserRouter>*/}

  
    
  </>

);
