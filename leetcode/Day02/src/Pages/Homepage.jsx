import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);

      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' ||
      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
      {/* Navbar */}
      <nav className="rounded-xl px-6 py-3 mb-6 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-gray-800">Code Arena</NavLink>
        <div className="flex items-center space-x-4">
          <div className="relative group focus-within:z-50">
            <button
              className="btn btn-sm bg-white text-gray-700 border border-gray-300 shadow-sm focus:outline-none"
            >
              {user?.firstName}
            </button>

            <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-md rounded-lg shadow-lg invisible group-focus-within:visible transition-opacity duration-200">
              <ul className="menu menu-sm text-black">
                <li><button onClick={handleLogout}>Logout</button></li>
                {user.role === 'admin' && <li><NavLink to="/admin">Admin</NavLink></li>}
              </ul>
            </div>
        </div>
        </div>
      </nav>

      {/* Filters */}
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            className="select select-bordered w-full sm:w-auto"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>
          <select
            className="select select-bordered w-full sm:w-auto"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select
            className="select select-bordered w-full sm:w-auto"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>
      </div>

      {/* Problem List */}
      <div className="max-w-4xl mx-auto grid gap-6">
        {filteredProblems.map(problem => (
          <div key={problem._id} className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <NavLink to={`/problem/${problem._id}`} className="text-lg font-semibold text-gray-800 hover:text-indigo-600">
                {problem.title}
              </NavLink>
              {solvedProblems.some(sp => sp._id === problem._id) && (
                <span className="badge badge-success flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                  Solved
                </span>
              )}
            </div>
            <div className="mt-2 flex gap-3 text-sm">
              <span className={`badge ${getDifficultyBadgeColor(problem.difficulty)} capitalize`}>
                {problem.difficulty}
              </span>
              <span className="badge badge-info capitalize">
                {problem.tags}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Homepage;