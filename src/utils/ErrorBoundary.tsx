// ErrorBoundary.tsx
import { ErrorInfo, ReactNode, Component } from "react";
import { Navigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

class ErrorResponse extends Error {
  statusCode: number;
  timestamp: Date;
  details?: string;
  parameters?: string;

  constructor(
    statusCode: number,
    timestamp: Date,
    message: string,
    details: string | undefined,
    parameters: string | undefined
  ) {
    super(message);

    Object.setPrototypeOf(this, ErrorResponse.prototype);
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.details = details;
    this.parameters = parameters;
  }
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const createErrorResponse = (
  statusCode: number,
  message: string = "Unknown server reply",
  details?: string,
  timestamp: Date = new Date(),
  parameters?: string
): ErrorResponse => {
  return new ErrorResponse(statusCode, timestamp, message, details, parameters);
};
/*
 * This is use to handle error where exception throw, it will redirect to an error page
 * which needs to upgrade later
 *
 * The ErrorBoundary component is set up to catch rendering errors, lifecycle method errors,
 * and constructor errors within its child component tree. Some error throw cannot handle by
 * this class
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by Custom ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Navigate to="/error" />;
    }

    return this.props.children;
  }
}

const errorHandling = (thunkApi: any) => {
  return (error: Error | AxiosError | ErrorResponse) => {
    if (axios.isAxiosError(error) && error.response) {
      return thunkApi.rejectWithValue(
        createErrorResponse(
          error?.response?.status,
          error?.response?.data.details
            ? error?.response?.data.details
            : error?.response?.statusText,
          error?.response?.data.message,
          error?.response?.data.timestamp,
          error?.response?.data.parameters
        )
      );
    } else {
      return thunkApi.rejectWithValue(error);
    }
  };
};

export { createErrorResponse, errorHandling, ErrorResponse };

export default ErrorBoundary;
// TODO: move this to different place that is more related
