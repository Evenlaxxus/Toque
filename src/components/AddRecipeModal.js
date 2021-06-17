import React, {useState} from "react"
import {Button, Col, FormControl, Modal, Row} from "react-bootstrap";
import firebase from "../firebase";
import {useAuth} from "../context/AuthContext";
import {wait} from "@testing-library/react";

const AddRecipeModal = ({edit= false, toEdit = {title: "", description: "", ingredients: [], preparation: ""}}) => {
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
        ).then(handleClose).then(() => {
            wait(1)
            window.location.reload()
        })
    };

    const editRecipe = () => {
        const db = firebase.firestore()
        db.collection('recipes').doc(toEdit.id).update({
            title: title,
            description: description,
            ingredients: ingredients,
            preparation: preparation
            }
        ).then(handleClose).then(() => {
            wait(1)
            window.location.reload()
        })
    };

    React.useEffect(() => {
        setTitle(toEdit.title)
        setDescription(toEdit.description)
        setIngredients(toEdit.ingredients)
        setPreparation(toEdit.preparation)
    }, [])

    return (
        <>
            {edit && (<Button variant="primary" onClick={handleShow}>
                Edit recipe
            </Button>)}
            {!edit &&(<Button variant="primary" onClick={handleShow}>
                Add recipe
            </Button>)}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl className="mb-2" type="text" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)}/>
                    <FormControl className="my-2" type="text" placeholder="Description" value={description}
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
                            <FormControl className="my-2" value={preparation} as="textarea" rows={3} placeholder="Preparation method"
                                         onChange={(event) => setPreparation(event.target.value)}/>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {edit ? (<Button variant="primary" onClick={editRecipe}>
                        Edit Recipe
                    </Button>) : (<Button variant="primary" onClick={addRecipe}>
                        Add Recipe
                    </Button>)}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddRecipeModal