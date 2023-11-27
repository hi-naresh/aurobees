import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/common/MainLayout";
import Chats from "./components/chat/Chats";
import TinderCards from "./components/swipe/TinderCards";
import Profile from "./components/dashboard/Profile";
import Matches from "./components/matches/Matches";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/authentication/Login";
import SignUp from "./components/authentication/SignUp";
import Onboarding from "./components/onboard/Onboarding";
import PrivateRoute from "./routes/PrivateRoutes";
import PublicRoute from "./routes/PublicRoutes"; // Import PublicRoute
import PersonalDetails from "./components/authentication/personal-form/PersonalDetails";
import PhotoUpload from "./components/authentication/personal-form/PhotoUpload";
import InterestsForm from "./components/authentication/personal-form/InterestsForm";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import ChatScreen from "./components/chat/ChatScreen";
import { SnackbarProvider } from "./components/common/SnackBar";
import Bio from "./components/dashboard/settings/Bio_pics";
import EmailVerificationStatus from "./components/authentication/EmailVerificationStatus";

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <Router>
          <Switch>
            {/* These are your public routes, they will not have MainLayout */}
            <PublicRoute path="/" exact component={Onboarding} />
            <PublicRoute path="/login" component={Login} />
            <PublicRoute path="/signup" component={SignUp} />
            <PrivateRoute path="/email-verify" component={EmailVerificationStatus} />
            <PrivateRoute path="/personal-details" component={PersonalDetails} />
            <PrivateRoute path="/photo-upload" component={PhotoUpload} />
            <PrivateRoute path="/interests-form" component={InterestsForm} />
            <PrivateRoute path="/chat/:userId" component={ChatScreen} />
            <PrivateRoute path="/bio-pics" component={Bio}/>
            <Route>
              <MainLayout>
                <Switch>
                  <PrivateRoute path="/chat" component={Chats} />
                  <PrivateRoute path="/profile" component={Profile} />
                  <PrivateRoute path="/matches" component={Matches} />
                  <PrivateRoute path="/swipe" component={TinderCards} />
                </Switch>
              </MainLayout>
            </Route>
          </Switch>
        </Router>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
