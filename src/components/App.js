import React from 'react'
import Signup from './Signup'
import {AuthProvider} from "../context/AuthContext"
import {Container, Row} from "react-bootstrap"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from './Login'
import PrivateRoute from "./PrivateRoute";
import NavbarWrapper from "./NavbarWrapper";

function App() {

    return (
        <AuthProvider>
            <NavbarWrapper/>
            <Container className="pt-4">
                <Row>
                    <Router>
                        <Switch>
                            <Route exact path="/" component={Login}/>
                            <Route path="/signup" component={Signup}/>
                            <PrivateRoute path="/dashboard" component={Dashboard}/>
                            {/*<Route path="/login" component={Login} />*/}
                        </Switch>
                    </Router>
                </Row>
            </Container>
        </AuthProvider>

    )
}

export default App;
