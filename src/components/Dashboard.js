import React from 'react'
import firebase from '../firebase'
import {Card, Col} from "react-bootstrap";


export default function Dashboard() {
    const [recipes, setRecipes] = React.useState([{title: '', ingredients: []}])
    const fetchData = async () => {
        const db = firebase.firestore()
        console.log(db)
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
            {recipes.map(recipe => (
                <Card key={recipe.title}>
                    <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
                    <Card.Body>
                        <Card.Title>
                            {recipe.title}
                        </Card.Title>
                        <Card.Text>
                            {recipe.ingredients.map((ingredient, index) => (
                                <span key={index}>
                                    {ingredient.name}
                                </span>
                            ))}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </Col>
    )
}
