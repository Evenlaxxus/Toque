import React from 'react'
import firebase from '../firebase'

function App() {
  const [recipes, setRecipes] = React.useState([])

  React.useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore()
      const data = await db.collection("recipes").get()
      setRecipes(data.docs.map(doc => doc.data()))
    }
    fetchData()
  }, [])

  return (
    <ul>
      {recipes.map(recipe => (
        <li key={recipe.title}>{recipe.title}</li>
      ))}
    </ul>
  )
}

export default App;
