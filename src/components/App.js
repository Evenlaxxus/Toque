import React from 'react'
import Signup from './Signup'
import {AuthProvider} from "../context/AuthContext"
import {Col, Container, Nav, Row} from "react-bootstrap"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from './Login'
import PrivateRoute from "./PrivateRoute";

function App() {

    return (
        <Container>
            <Row>
                <Col>
                    <Nav
                        className="justify-content-end"
                        defaultActiveKey="/"
                    >
                        <Nav.Item>
                            <Nav.Link href="/">Login</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/signup">Signup</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
            </Row>
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
    )
}

export default App;
