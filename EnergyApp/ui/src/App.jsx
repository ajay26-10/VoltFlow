import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RecordEnergy from './pages/RecordEnergy';
import GetEnergy from './pages/GetEnergy';
import ListEnergy from './pages/ListEnergy';
import PurchaseEnergy from './pages/PurchaseEnergy';
import AuditSale from './pages/AuditSale';
import EnergyDetails from './pages/EnergyDetails';
import ExcessEnergy from './pages/ExcessEnergy';
import LoanApproval from './pages/LoanApproval';
import HomePage from './pages/Homepage';
import Producer from './pages/Producer';
import Consumer from './pages/Consumer';
import Regulator from './pages/Regulator';
import Storage from './pages/Storage';
import Finance from './pages/Finance';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/producer" element={<Producer />} />
        <Route path="/consumer" element={<Consumer />} />
        <Route path="/regulator" element={<Regulator />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/recordenergy" element={<RecordEnergy />} />
        <Route path="/getenergy" element={<GetEnergy />} />
        <Route path="/listenergy" element={<ListEnergy />} />
        <Route path="/purchaseenergy" element={<PurchaseEnergy />} />
        <Route path="/auditsale" element={<AuditSale />} />
        <Route path="/energydetails" element={<EnergyDetails />} />
        <Route path="/excessenergy" element={<ExcessEnergy />} />
        <Route path="/loanapproval" element={<LoanApproval />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
