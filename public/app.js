
document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
  
    const db = firebase.fiestore();
  
    const myRecipe = db.collection('recipes').doc('ETtBZeTtAkPLOZweovOd');
  
    myRecipe.get().then(doc => {
  
      const data = doc.data();
      document.write( data.Title + `<br>`)
    })
  });