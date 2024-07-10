// ErrorPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Error Occurred</h1>
      <p>Something went wrong. Please try again later.</p>
      <button onClick={() => navigate("/")}>Go Back Home</button>
    </div>
  );
};

export default ErrorPage;
