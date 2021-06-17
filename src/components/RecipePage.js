import React from 'react'
import firebase from '../firebase'
import {Button, Card, CardColumns, Col, Row} from "react-bootstrap";
import {useParams} from "react-router";
import {Link, useHistory} from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import {useAuth} from "../context/AuthContext";
import AddRecipeModal from "./AddRecipeModal";

export default function UserDashboard() {
    const {id} = useParams();
    const history = useHistory()

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
                        const res = {id: data.id, ...data.data()}
                        setRecipe(res)
                    }
                )
            return await db.collection("ratings").where("recipe", "==", id).get()
                .then(data => {
                    const res = data.docs.map((doc) => ({...doc.data()}))[0]
                    const doc = data.docs.map((doc) => doc.id)[0]
                    if (doc === undefined) return 0
                    setDocId(doc)
                    setRatings(res["ratings"])
                    const rating = res["ratings"].reduce((previousValue, currentValue) => previousValue + currentValue.rating, 0)
                    return rating/res["ratings"].length
                })
        }
    }

    const deleteRecipe = () => {
        const db = firebase.firestore()
        db.collection("recipes").doc(recipe.id).delete()
        history.push("/")
    }

    const updateRecipe = (newRating) => {
        const db = firebase.firestore()
        const rated = !!ratings.filter(e => e.user === currentUser.uid).length
        let newRatings = []
        if (docId === "") {
            db.collection("ratings").add({
                recipe: recipe.id,
                ratings: [{user: currentUser.uid, rating: newRating}]
            })
        } else {
            if (rated) {
                newRatings = [{user: currentUser.uid, rating: newRating}, ...ratings.filter(e => e.user !== currentUser.uid)]
            } else {
                newRatings = [{user: currentUser.uid, rating: newRating}, ...ratings]
            }
            db.collection("ratings").doc(docId).update({
                ratings: newRatings,
            })
        }

        fetchData().then(res => setRating(res))
    }


    const reload = () => {
        console.log("dupa")
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
                    <Row>
                        <Col xs={12} md={5}>
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
                        {currentUser.uid === recipe.user && (
                            <React.Fragment>
                                <Col xs={12} md={3}>
                                    <AddRecipeModal edit={true} toEdit={recipe} onHide={reload}/>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Button variant="primary" onClick={deleteRecipe}>
                                        Delete recipe
                                    </Button>
                                </Col>
                            </React.Fragment>
                        )}
                    </Row>
                </Col>
            </Row>
            <Row>
                <Link className="pl-3" to={`/dashboard/${recipe.user}`}>Author dashboard</Link>
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
