import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Reviews from './pages/Reviews';
import GiveReview from './pages/GiveReview';
import Contact from './pages/Contact';
import About from './pages/About';
import Community from './pages/Community';
import { supabase } from './supabase';

import AdminLogin from './pages/AdminLogin';

import VideoIntro from './components/VideoIntro';
import ChatBot from './components/ChatBot';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoPlayed, setVideoPlayed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader"></div>
    </div>;
  }

  return (
    <Router>
      <div className="app">
        {!videoPlayed && <VideoIntro onComplete={() => setVideoPlayed(true)} />}
        <Navbar session={session} />
        <div>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={session ? <Dashboard session={session} /> : <Navigate to="/login" />} />
            <Route path="/community" element={<Community session={session} />} />

            <Route path="/review" element={session ? <GiveReview session={session} /> : <Navigate to="/login" />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
