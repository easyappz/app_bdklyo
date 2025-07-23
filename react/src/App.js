import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Feed from './components/Feed';
import SideMenu from './components/SideMenu';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <SideMenu />
          <div className="main-content">
            <Header title="Социальная сеть" />
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/feed" element={<Feed />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
