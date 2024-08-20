function extractIngredientsList() {
  const titleKeywords = ['ingredients', 'ingrédients', 'ingredientes', 'composition', 'contents'];
  let ingredients = [];

  // 1. Locate the title element
  const titleElement = [...document.querySelectorAll('*')]
      .find(el => titleKeywords.some(keyword => el.textContent.toLowerCase().includes(keyword)));

  if (!titleElement) {
      console.error('No ingredients title found on the page.');
      return ingredients;
  }

  // 2. Look for the list of ingredients within a certain range of elements after the title
  let currentElement = titleElement.nextElementSibling;

  while (currentElement && ingredients.length === 0) {
      if (currentElement.matches('ul, ol')) {
          // List of ingredients in a <ul> or <ol>
          ingredients = [...currentElement.querySelectorAll('li')].map(li => li.textContent.trim());
      } else if (currentElement.matches('p, div')) {
          // Ingredients may be in <p> or <div> as a series of inline elements
          const potentialText = currentElement.textContent.trim();
          // Split by common delimiters
          ingredients = potentialText.split(/,|;|\n/).map(item => item.trim()).filter(Boolean);
      }

      currentElement = currentElement.nextElementSibling;
  }

  if (ingredients.length === 0) {
      console.error('No ingredients list found near the title.');
  }

  return ingredients;
}

function sendIngredientsToBackend(ingredients) {
  fetch('http://localhost:4567/check_health', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ingredients: ingredients })
  })
  .then(response => response.json())
  .then(data => {
      alert(`Health rating: ${data.score}/5`);
  })
  .catch(error => console.error('Error:', error));
}

// Execute the script
const ingredients = extractIngredientsList();
if (ingredients.length > 0) {
  sendIngredientsToBackend(ingredients);
} else {
  alert('No ingredients list found on this page.');
}
