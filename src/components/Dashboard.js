import React from 'react'
import firebase from '../firebase'
import {Card, CardColumns, Col, Form, FormControl, ListGroup, Row} from "react-bootstrap";
import AddRecipeModal from "./AddRecipeModal";
import {useAuth} from "../context/AuthContext";
import {useParams} from "react-router";
import {Link} from "react-router-dom";
import Rating from '@material-ui/lab/Rating';

export default function UserDashboard() {
    const {uid} = useParams();


    const [recipes, setRecipes] = React.useState([])
    const [filtered, setFiltered] = React.useState([])

    const {currentUser} = useAuth()

    const isAuthenticated = !!currentUser


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
        if (uid) {
            return await db.collection("recipes").where("user", "==", uid).get()
                .then(data => getData(data, db))
        } else {
            return await db.collection("recipes").get()
                .then(data => getData(data, db))
        }
    }

    const getData = async (data, db) => {
        const res = data.docs.map((doc) => ({id: doc.id, ...doc.data()}))

        for (let i=0; i < res.length; i++) {
            await db.collection("ratings").where("recipe", "==", res[i].id).get()
                .then(data1 => {
                    const res = data1.docs.map((doc) => ({...doc.data()}))[0]
                    if (res === undefined) return 0
                    const rating = res["ratings"].reduce((previousValue, currentValue) => previousValue + currentValue.rating, 0)
                    return rating/res["ratings"].length
                }).then(e => {
                res[i]["rating"] = e
            })
        }
        return res
    }

    React.useEffect(() => {
        fetchData().then(e => {
            setRecipes(e)
            setFiltered(e)
        })
    }, [])

    return (
        <Col>
            <Row>
                {isAuthenticated && (<Col className="mb-3">
                    <AddRecipeModal/>
                </Col>)}
                <Col xs={12} md={8} className="mb-3">
                    <Form onSubmit={submitHandler}>
                        <FormControl type="text" placeholder="Search" onChange={filterRecipes.bind(this)}/>
                    </Form>
                </Col>
            </Row>
            <CardColumns>
                {filtered.map(recipe => (
                    <Card key={recipe.id}>
                        <Card.Body>
                            <Link to={`/recipe/${recipe.id}`}>
                                <Card.Title>
                                    {recipe.title}
                                </Card.Title>
                            </Link>
                            <Card.Text>
                                {recipe.description}
                                <br/>
                                <Rating name="half-rating" value={recipe.rating} precision={0.5} readOnly />
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
