import React from 'react'
import firebase from '../firebase'
import {Card, CardColumns, Col, Row} from "react-bootstrap";
import {useParams} from "react-router";
import {Link} from "react-router-dom";

export default function UserDashboard() {
    const { id } = useParams();


    const [recipe, setRecipe] = React.useState({})

    const fetchData = async () => {
        const db = firebase.firestore()
        if (id) {
            await db.collection("recipes").doc(id).get()
                .then(data => {
                        const res = data.data()
                        setRecipe(res)
                    }
                )
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    return !recipe ? (<span>Loading</span>) : (
        <Col>
            <Row>
                <h1>{recipe.title}</h1>
            </Row>
            <Row>
                <Link to={`/dashboard/${recipe.user}`}>User dashboard</Link>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    {recipe.description}
                </Col>
                <Col xs={12} md={6}>
                    <CardColumns>
                    {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                        <Card key={index}>
                            <Card.Body>
                                <Card.Title>
                                    {ingredient.name}
                                </Card.Title>
                                <Card.Text>
                                    {ingredient.quantity}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                    </CardColumns>
                </Col>
            </Row>
            <Row>
                <Col>
                    {recipe.preparation}
                </Col>
            </Row>
        </Col>
    )
}
