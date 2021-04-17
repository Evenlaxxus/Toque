import React from 'react'
import app from '../firebase'

function App() {
  const [recipes, setRecipes] = React.useState([])

  React.useEffect(() => {
    const fetchData = async () => {
      const db = app.firestore()
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
