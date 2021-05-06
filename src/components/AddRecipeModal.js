import React, {useState} from "react"
import {Button, Col, FormControl, Modal, Row} from "react-bootstrap";
import firebase from "../firebase";

const AddRecipeModal = () => {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [ingredientName, setIngredientName] = useState("");
    const [ingredientQuantity, setIngredientQuantity] = useState("");

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    const clearIngredients = () => {
        setIngredients([])
    }

    const addIngredient = () => {
        ingredients.push({
            name: ingredientName,
            quantity: ingredientQuantity
        })

        setIngredientName("")
        setIngredientQuantity("")
    }

    const addRecipe = () => {
        const db = firebase.firestore()
        db.collection('recipes').add({
                title,
                description,
                ingredients
            }
        ).then(handleClose)
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add recipe
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl className="mb-2" type="text" placeholder="Title" onChange={(event) => setTitle(event.target.value)}/>
                    <FormControl className="my-2" type="text" placeholder="Description"
                                 onChange={(event) => setDescription(event.target.value)}/>

                    <ul className="my-1">
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient.name} - {ingredient.quantity}</li>
                        ))}
                    </ul>

                    <Row>
                        <Col>
                            <FormControl className="my-2" type="text" placeholder="Ingredient Name"
                                         onChange={(event) => setIngredientName(event.target.value)}/>
                        </Col>
                        <Col>
                            <FormControl className="my-2" type="text" placeholder="Ingredient Quantity"
                                         onChange={(event) => setIngredientQuantity(event.target.value)}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button block type="fluid" variant="secondary" onClick={addIngredient}>Add Ingredient</Button>
                        </Col>
                        <Col>
                            <Button block type="fluid" variant="secondary" onClick={clearIngredients}>Clear Ingredients</Button>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addRecipe}>
                        Add Recipe
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddRecipeModal