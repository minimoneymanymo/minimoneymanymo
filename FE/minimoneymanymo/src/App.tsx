
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChildPage from './pages/ChildPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ParentPage from './pages/ParentPage';
import Layout from './layouts/Layout';
function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route path="/child" element={<ChildPage />}/>  
      <Route path="/login" element={<LoginPage />}/>  
      <Route path="/main" element={<MainPage />}/>  
      <Route path="/parent" element={<ParentPage />}/>  
      </Route>  
    </Routes>
  </Router>
  )
}

export default App
