import React from 'react'
import Signup from './Signup'
import {AuthProvider} from "../context/AuthContext"
import {Container, Nav, Navbar, Row} from "react-bootstrap"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from './Login'
import PrivateRoute from "./PrivateRoute";

function App() {

    return (
        <React.Fragment>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Toque</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/">Login</Nav.Link>
                    <Nav.Link href="/signup">Signup</Nav.Link>
                    <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                </Nav>
            </Navbar>
            <Container>
                <Row>
                    <Router>
                        <AuthProvider>
                            <Switch>
                                <Route exact path="/" component={Login}/>
                                <Route path="/signup" component={Signup}/>
                                <PrivateRoute path="/dashboard" component={Dashboard}/>
                                {/*<Route path="/login" component={Login} />*/}
                            </Switch>
                        </AuthProvider>
                    </Router>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default App;
