import React from 'react';
import { browserHistory } from 'react-router';

const Home = () => (
  <nav className="navbar navbar-default navbar-fixed-top">
    <div className="container">
      <button onClick={() => browserHistory.push('commande')} type="button" className="btn btn-default navbar-btn">Commandes en ligne</button>
      <button onClick={() => browserHistory.push('abonnement')} type="button" className="btn btn-default navbar-btn">Abonnements en ligne</button>
    </div>
  </nav>
);

export default Home;
