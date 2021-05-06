import React from 'react'
import firebase from '../firebase'
import {Card, CardColumns, Col, ListGroup} from "react-bootstrap";


export default function Dashboard() {
    const [recipes, setRecipes] = React.useState([{title: '', ingredients: []}])
    const fetchData = async () => {
        const db = firebase.firestore()
        db.collection("recipes").get()
            .then(data =>
                setRecipes(
                    data.docs.map(doc => doc.data())
                )
            )
    }
    React.useEffect(() => {
        fetchData()
    }, [])

    return (
        <Col>
            <CardColumns>
                {recipes.map(recipe => (
                    <Card key={recipe.title}>
                        <Card.Img variant="top" src="hero.jpg" />
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
