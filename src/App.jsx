import React, { useState } from 'react';
import Hero from './components/Hero';
import TopicCard from './components/TopicCard';
import ContactForm from './components/ContactForm';
import FinancialAnalysis from './pages/FinancialAnalysis';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('financial'); // 'landing' or 'financial'
  const googleFormUrl = null; // 나중에 구글폼 URL로 교체

  return (
    <div className="App">
      <nav className="main-nav">
        <button 
          className={`nav-tab ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          재무 분석
        </button>
        <button 
          className={`nav-tab ${activeTab === 'landing' ? 'active' : ''}`}
          onClick={() => setActiveTab('landing')}
        >
          AI 윤리 교육
        </button>
      </nav>

      {activeTab === 'financial' ? (
        <FinancialAnalysis />
      ) : (
        <>
          <Hero />
          <TopicCard />
          <ContactForm googleFormUrl={googleFormUrl} />
        </>
      )}
    </div>
  );
}

export default App;

