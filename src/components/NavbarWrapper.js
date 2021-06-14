import React, { useState }  from "react"
import {Button, Nav, Navbar} from "react-bootstrap";
import { useAuth } from "../context/AuthContext"
import { useHistory } from "react-router-dom"

const NavbarWrapper = () => {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push("/")
        } catch {
            setError("Failed to log out")
        }
    }


    const isAuthenticated = !!currentUser
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Toque</Navbar.Brand>
            <Nav className="mr-auto">
                {isAuthenticated && (<Nav.Link href="/">Dashboard</Nav.Link>)}
            </Nav>
            {isAuthenticated && (<Button className="mr-sm-2" variant="secondary" onClick={handleLogout}>Logout</Button>)}
            {!isAuthenticated && (<Button className="mr-sm-2" variant="secondary" href="/login">Login</Button>)}
            {!isAuthenticated && (<Button className="mr-sm-2" variant="secondary" href="/signup">Signup</Button>)}
        </Navbar>
    )
}

export default NavbarWrapper