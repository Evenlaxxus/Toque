import React from 'react'
import firebase from '../firebase'
import {Card, CardColumns, Col, Row} from "react-bootstrap";
import {useParams} from "react-router";
import {Link} from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import {useAuth} from "../context/AuthContext";

export default function UserDashboard() {
    const {id} = useParams();

    const { currentUser } = useAuth()

    const isAuthenticated = !!currentUser

    const [recipe, setRecipe] = React.useState({})
    const [rating, setRating] = React.useState(0)
    const [ratings, setRatings] = React.useState([])
    const [docId, setDocId] = React.useState("")

    const fetchData = async () => {
        const db = firebase.firestore()
        if (id) {
            await db.collection("recipes").doc(id).get()
                .then(data => {
                        const res = data.data()
                        setRecipe(res)
                    }
                )
            return await db.collection("ratings").where("recipe", "==", id).get()
                .then(data => {
                    const res = data.docs.map((doc) => ({...doc.data()}))[0]
                    const doc = data.docs.map((doc) => doc.id)[0]
                    setDocId(doc)
                    setRatings(res["ratings"])
                    const rating = res["ratings"].reduce((previousValue, currentValue) => previousValue + currentValue.rating, 0)
                    return rating/res["ratings"].length
                })
        }
    }

    const updateRecipe = (newRating) => {
        const db = firebase.firestore()
        const rated = !!ratings.filter(e => e.user === currentUser.uid).length
        let newRatings = []
        if (rated) {
            newRatings = [{user: currentUser.uid, rating: newRating}, ...ratings.filter(e => e.user !== currentUser.uid)]

        } else {
            newRatings = [{user: currentUser.uid, rating: newRating}, ...ratings]
        }
        db.collection("ratings").doc(docId).update({
            ratings: newRatings,
        })
    }

    React.useEffect(() => {
        fetchData().then(res => setRating(res))
    }, [])

    return !recipe ? (<span>Loading</span>) : (
        <Col>
            <Row>
                <Col>
                    <h1>{recipe.title}</h1>
                </Col>
                <Col className="pt-3">
                    {isAuthenticated && (<Rating
                        name="half-rating"
                        value={rating}
                        precision={0.5}
                        onChange={(event, newValue) => {
                            updateRecipe(newValue);
                        }}
                    />)}
                    {!isAuthenticated && (<Rating
                        name="half-rating"
                        value={rating}
                        precision={0.5}
                        readOnly
                    />)}
                </Col>
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
