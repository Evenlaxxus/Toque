import React from 'react'
import firebase from '../firebase'
import {Card, CardColumns, Col, Form, FormControl, ListGroup, Row} from "react-bootstrap";
import AddRecipeModal from "./AddRecipeModal";


export default function Dashboard() {
    const [recipes, setRecipes] = React.useState([])
    const [filtered, setFiltered] = React.useState([])

    function submitHandler(e) {
        e.preventDefault();
    }

    function filterRecipes(v) {
        const query = v.target.value
        setFiltered(recipes.filter(e => {
            return e.title.includes(query)
        }))
    }

    const fetchData = async () => {
        const db = firebase.firestore()
        db.collection("recipes").get()
            .then(data => {
                    const res = data.docs.map(doc => doc.data())
                    setRecipes(res)
                    setFiltered(res)
                }
            )
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    return (
        <Col>
            <Row>
                <Col className="mb-3">
                    <AddRecipeModal />
                </Col>
                <Col xs={12} md={8} className="mb-3">
                    <Form onSubmit={submitHandler}>
                        <FormControl type="text" placeholder="Search" onChange={filterRecipes.bind(this)}/>
                    </Form>
                </Col>
            </Row>
            <CardColumns>
                {filtered.map(recipe => (
                    <Card key={recipe.title}>
                        <Card.Body>
                            <Card.Title>
                                {recipe.title}
                            </Card.Title>
                            <Card.Text>
                                {recipe.description}
                            </Card.Text>
                            <ListGroup>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <ListGroup.Item key={index}>
                                        {ingredient.name} - {ingredient.quantity}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                ))}
            </CardColumns>
        </Col>
    )
}
