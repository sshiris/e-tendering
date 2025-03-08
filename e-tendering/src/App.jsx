import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const [selectedTender, setSelectedTender] = useState(null);

  useEffect(() => {
    const mockTenders = [
      {
        id: 1,
        title: "City Infrastructure Project",
        description: "Development of city roads and bridges",
        budget: "$2,000,000",
        deadline: "2025-06-30",
        status: "Open",
      },
      {
        id: 2,
        title: "Hospital Equipment Supply",
        description: "Supply of medical equipment to regional hospitals",
        budget: "$500,000",
        deadline: "2025-05-15",
        status: "Open",
      },
      {
        id: 3,
        title: "School Renovation Project",
        description: "Renovation of 5 public schools",
        budget: "$800,000",
        deadline: "2025-07-10",
        status: "Open",
      },
    ];
    setTenders(mockTenders);

    const mockBids = [
      {
        id: 1,
        tenderId: 1,
        company: "BuildRight Ltd",
        amount: "$1,950,000",
        proposal: "Complete road development with 5-year warranty",
      },
      {
        id: 2,
        tenderId: 2,
        company: "MedSupply Inc",
        amount: "$480,000",
        proposal: "Full equipment package with 3-year maintenance",
      },
    ];
    setBids(mockBids);
  }, []);

  const handleLogin = (credentials) => {
    if (credentials.email && credentials.password) {
      const userData = {
        id: 1,
        name: "John Doe",
        email: credentials.email,
        company: "Example Corp",
        role: "contractor",
      };
      setIsAuthenticated(true);
      setUser(userData);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const createTender = (tenderData) => {
    const newTender = {
      id: tenders.length + 1,
      ...tenderData,
      status: "Open",
    };
    setTenders([...tenders, newTender]);
  };

  const submitBid = (bidData) => {
    const newBid = {
      id: bids.length + 1,
      tenderId: selectedTender.id,
      ...bidData,
    };
    setBids([...bids, newBid]);
  };

  const Navbar = () => {
    const navigate = useNavigate();
    return (
      <nav className="navbar">
        <div className="navbar-brand">Tender Management System</div>
        <div className="navbar-menu">
          <div className="navbar-start">
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/tenders")}>Tenders</button>
            {user?.role === "admin" && (
              <button onClick={() => navigate("/create-tender")}>
                Create Tender
              </button>
            )}
          </div>
          <div className="navbar-end">
            {isAuthenticated ? (
              <>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button onClick={() => navigate("/login")}>Login</button>
            )}
          </div>
        </div>
      </nav>
    );
  };

  const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin({ email, password });
      navigate("/dashboard");
    };

    return (
      <div className="login-container">
        <h2>Login to Tender Management System</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
      </div>
    );
  };

  const Dashboard = () => {
    const navigate = useNavigate();
    const userBids = bids.filter((bid) => user?.company === bid.company);

    return (
      <div className="dashboard-container">
        <h2>Welcome, {user?.name || "User"}</h2>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Open Tenders</h3>
            <p className="stat-number">
              {tenders.filter((t) => t.status === "Open").length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Your Bids</h3>
            <p className="stat-number">{userBids.length}</p>
          </div>
          <div className="stat-card">
            <h3>Closing Soon</h3>
            <p className="stat-number">
              {
                tenders.filter((t) => {
                  const deadline = new Date(t.deadline);
                  const today = new Date();
                  const diffDays = Math.floor(
                    (deadline - today) / (1000 * 60 * 60 * 24)
                  );
                  return diffDays <= 7 && t.status === "Open";
                }).length
              }
            </p>
          </div>
        </div>
        <div className="recent-tenders">
          <h3>Recent Tenders</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Budget</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tenders.slice(0, 3).map((tender) => (
                <tr key={tender.id}>
                  <td>{tender.title}</td>
                  <td>{tender.budget}</td>
                  <td>{tender.deadline}</td>
                  <td>{tender.status}</td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(`/tender/${tender.id}`, { state: tender })
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const TenderList = () => {
    const navigate = useNavigate();
    return (
      <div className="tender-list-container">
        <h2>Available Tenders</h2>
        <div className="filter-container">
          <input type="text" placeholder="Search tenders..." />
          <select>
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Awarded">Awarded</option>
          </select>
        </div>
        <table className="tender-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Budget</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenders.map((tender) => (
              <tr key={tender.id}>
                <td>{tender.title}</td>
                <td>{tender.description}</td>
                <td>{tender.budget}</td>
                <td>{tender.deadline}</td>
                <td>{tender.status}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/tender/${tender.id}`, { state: tender })
                    }
                  >
                    View
                  </button>
                  {isAuthenticated && tender.status === "Open" && (
                    <button
                      onClick={() =>
                        navigate(`/tender/${tender.id}/bid`, { state: tender })
                      }
                    >
                      Bid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const TenderDetails = ({ location }) => {
    const navigate = useNavigate();
    const tender = location?.state || selectedTender;
    if (!tender) return <div>No tender selected</div>;

    const tenderBids = bids.filter((bid) => bid.tenderId === tender.id);

    return (
      <div className="tender-details-container">
        <h2>{tender.title}</h2>
        <div className="tender-details">
          <div className="detail-item">
            <strong>Description:</strong> {tender.description}
          </div>
          <div className="detail-item">
            <strong>Budget:</strong> {tender.budget}
          </div>
          <div className="detail-item">
            <strong>Deadline:</strong> {tender.deadline}
          </div>
          <div className="detail-item">
            <strong>Status:</strong> {tender.status}
          </div>
        </div>
        {isAuthenticated && tender.status === "Open" && (
          <button
            className="btn-primary"
            onClick={() =>
              navigate(`/tender/${tender.id}/bid`, { state: tender })
            }
          >
            Submit Bid
          </button>
        )}
        {user?.role === "admin" && (
          <div className="bids-section">
            <h3>Submitted Bids</h3>
            {tenderBids.length > 0 ? (
              <table className="bids-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Amount</th>
                    <th>Proposal</th>
                  </tr>
                </thead>
                <tbody>
                  {tenderBids.map((bid) => (
                    <tr key={bid.id}>
                      <td>{bid.company}</td>
                      <td>{bid.amount}</td>
                      <td>{bid.proposal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No bids submitted yet.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const CreateTender = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      createTender({ title, description, budget, deadline });
      navigate("/tenders");
    };

    return (
      <div className="create-tender-container">
        <h2>Create New Tender</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Create Tender
          </button>
        </form>
      </div>
    );
  };

  const SubmitBid = ({ location }) => {
    const navigate = useNavigate();
    const tender = location?.state || selectedTender;
    if (!tender) return <div>No tender selected</div>;

    const [company, setCompany] = useState(user?.company || "");
    const [amount, setAmount] = useState("");
    const [proposal, setProposal] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      submitBid({ company, amount, proposal });
      navigate("/tenders");
    };

    return (
      <div className="submit-bid-container">
        <h2>Submit Bid for: {tender.title}</h2>
        <div className="tender-summary">
          <p>
            <strong>Budget:</strong> {tender.budget}
          </p>
          <p>
            <strong>Deadline:</strong> {tender.deadline}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              readOnly={user ? true : false}
            />
          </div>
          <div className="form-group">
            <label>Bid Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Proposal Description</label>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Submit Bid
          </button>
        </form>
      </div>
    );
  };

  const Profile = () => {
    if (!user) return <div>Please login to view profile</div>;

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [company, setCompany] = useState(user.company);
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      setUser({ ...user, name, email, company });
      alert("Profile updated successfully!");
    };

    const userBids = bids.filter((bid) => bid.company === user.company);

    return (
      <div className="profile-container">
        <h2>User Profile</h2>
        <div className="profile-sections">
          <div className="profile-form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary">
                Update Profile
              </button>
            </form>
          </div>
          <div className="profile-bids-section">
            <h3>Your Bids</h3>
            {userBids.length > 0 ? (
              <table className="bids-table">
                <thead>
                  <tr>
                    <th>Tender</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userBids.map((bid) => {
                    const tender = tenders.find((t) => t.id === bid.tenderId);
                    return (
                      <tr key={bid.id}>
                        <td>{tender ? tender.title : "Unknown Tender"}</td>
                        <td>{bid.amount}</td>
                        <td>{tender ? tender.status : "Unknown"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>You haven't submitted any bids yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const Home = () => {
    const navigate = useNavigate();
    return (
      <div className="home-container">
        <h1>Welcome to the Tender Management System</h1>
        <p>
          Find and bid on procurement opportunities or create tenders for your
          organization.
        </p>
        {!isAuthenticated && (
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Login to Get Started
          </button>
        )}
      </div>
    );
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route path="/tenders" element={<TenderList />} />
            <Route path="/tender/:id" element={<TenderDetails />} />
            <Route
              path="/tender/:id/bid"
              element={
                isAuthenticated ? <SubmitBid /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/create-tender"
              element={
                isAuthenticated && user?.role === "admin" ? (
                  <CreateTender />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
