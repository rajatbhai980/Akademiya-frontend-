import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Profile from '../pages/profile/Profile';
import EditProfile from '../pages/profile/EditProfile';
import GameSetup from '../pages/game/GameSetup';
import GamePlay from '../pages/game/GamePlay';
import GameResults from '../pages/game/GameResults';
import Leaderboard from '../pages/leaderboard/Leaderboard';
import Store from '../pages/store/Store';
import AdminTool from '../pages/admin/AdminTool';
import NotFound from '../pages/NotFound';


import Search from '../pages/Search/Search';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile/:pk" element={<Profile />} />

        {/* Guest-playable game flow; results/perf sync happen only when authenticated */}
        <Route path="/play" element={<GameSetup />} />
        <Route path="/play/session/:sessionId" element={<GamePlay />} />
        <Route path="/play/results" element={<GameResults />} />

        {/* Authenticated-only */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/store" element={<Store />} />
        </Route>

        {/* Staff-only */}
        <Route element={<ProtectedRoute requireStaff />}>
          <Route path="/admin" element={<AdminTool />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
