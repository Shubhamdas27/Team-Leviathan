import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { User, LoginData, RegisterData } from "../types";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthAction {
  type:
    | "AUTH_START"
    | "AUTH_SUCCESS"
    | "AUTH_FAILURE"
    | "LOGOUT"
    | "UPDATE_USER";
  payload?: any;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start if token exists
  useEffect(() => {
    if (state.token) {
      loadUser();
    }
  }, []);

  const loadUser = async () => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authAPI.getProfile();

      if (response.data.success) {
        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user: response.data.data?.user,
            token: state.token,
          },
        });
      }
    } catch (error: any) {
      console.error("Failed to load user:", error);
      dispatch({ type: "AUTH_FAILURE" });
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const login = async (data: LoginData) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authAPI.login(data);

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user, token },
        });

        toast.success("Login successful!");
      }
    } catch (error: any) {
      dispatch({ type: "AUTH_FAILURE" });
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authAPI.register(data);

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user, token },
        });

        toast.success("Registration successful! Welcome to ReWear!");
      }
    } catch (error: any) {
      dispatch({ type: "AUTH_FAILURE" });
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  const updateUser = (user: User) => {
    // Update localStorage
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "UPDATE_USER", payload: user });
  };

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
