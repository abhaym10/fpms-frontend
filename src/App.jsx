import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import Dashboard from "./pages/Dashboard";
import Scenes from "./pages/Scenes";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import Budget from "./pages/Budget";
import Schedule from "./pages/Schedule";
import Crew from "./pages/Crew";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { authFetch } from "./utils/authFetch";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    authFetch("https://fpms-backend-19w5.onrender.com/api/projects")
        .then(res => res.json())
        .then(data => {
          setProjects(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch projects", err);
          setLoading(false);
        });
  }, []);

  function addProject(projectData) {
    authFetch("https://fpms-backend-19w5.onrender.com/api/projects", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify(projectData),
    })
      .then((res) => res.json())
    .then((newProject) => {
      setProjects((prev) => [...prev, newProject]);
    })
    .catch((err) => {
      console.error("Failed to create project", err);
    });
}

function addSceneToProject(projectId, scene) {
  setProjects(
    projects.map((project) =>
      project.id === projectId
        ? { ...project, scenes: [...project.scenes, scene] }
        : project
    )
  );
}

function updateSceneInProject(projectId, updatedScene) {
  setProjects(
    projects.map((project) =>
      project.id === projectId
        ? {
          ...project,
          scenes: project.scenes.map((scene) =>
            scene.id === updatedScene.id ? updatedScene : scene
          ),
        }
        : project
    )
  );
}

function deleteSceneFromProject(projectId, sceneId) {
  setProjects(
    projects.map((project) =>
      project.id === projectId
        ? {
          ...project,
          scenes: project.scenes.filter(
            (scene) => scene.id !== sceneId
          ),
        }
        : project
    )
  );
}

if (loading) {
  return <p style={{ padding: "20px" }}>Loading projects...</p>;
}


return (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="projects" element={<ProtectedRoute><Projects projects={projects} /></ProtectedRoute>} />
      <Route path="/create" element={<CreateProject addProject={addProject} />} />
      <Route path="/dashboard/:projectId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route
        path="/projects/:projectId/scenes"
        element={<ProtectedRoute>
          <Scenes
            projects={projects}
            addSceneToProject={addSceneToProject}
            updateSceneInProject={updateSceneInProject}
            deleteSceneFromProject={deleteSceneFromProject}
          /></ProtectedRoute>
        }
      />
      <Route path="/projects/:projectId/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
      <Route path="/projects/:projectId/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
      <Route path="/projects/:projectId/crew" element={<ProtectedRoute><Crew /></ProtectedRoute>} />
      <Route path="/projects/:projectId/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>
);
}

export default App;