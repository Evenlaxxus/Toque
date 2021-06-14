import React, {useState} from "react"
import {Button, Col, FormControl, Modal, Row} from "react-bootstrap";
import firebase from "../firebase";
import {useAuth} from "../context/AuthContext";

const AddRecipeModal = () => {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [ingredientName, setIngredientName] = useState("");
    const [ingredientQuantity, setIngredientQuantity] = useState("");
    const [preparation, setPreparation] = useState("");

    const { currentUser } = useAuth()

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

    const user = currentUser.uid

    const addRecipe = () => {
        const db = firebase.firestore()
        db.collection('recipes').add({
                title,
                description,
                ingredients,
                preparation,
                user
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
                            <FormControl value={ingredientName} className="my-2" type="text" placeholder="Ingredient Name"
                                         onChange={(event) => setIngredientName(event.target.value)}/>
                        </Col>
                        <Col>
                            <FormControl value={ingredientQuantity} className="my-2" type="text" placeholder="Ingredient Quantity"
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
                    <Row>
                        <Col>
                            <FormControl className="my-2" as="textarea" rows={3} placeholder="Preparation method"
                                         onChange={(event) => setPreparation(event.target.value)}/>
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