import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home'
import MakePost from './pages/MakePost'
import Profile from './pages/Profile'
import Messages from './pages/Messages'

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/new-post" element={<MakePost />}/>
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
