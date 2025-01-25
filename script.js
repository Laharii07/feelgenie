document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generate-btn');
    const activityText = document.getElementById('activity');
    const body = document.body;

    const moodOptions = [
        { label: "Joke", api: "https://icanhazdadjoke.com/", headers: { Accept: "application/json" } },
        { label: "Quote", api: "https://api.quotable.io/random", headers: {} },
        { label: "Random Fact", api: "https://uselessfacts.jsph.pl/random.json?language=en", headers: {} },
        { label: "Dog Picture", api: "https://dog.ceo/api/breeds/image/random", headers: {} },
        { label: "Cat Picture", api: "https://api.thecatapi.com/v1/images/search", headers: {} },
        { label: "Food Recipe", api: "https://www.themealdb.com/api/json/v1/1/random.php", headers: {} },
        { label: "Nature Image", api: "https://source.unsplash.com/800x600/?nature", headers: {} }
    ];

    const moodSelect = document.getElementById('mood-select'); 

    generateBtn.addEventListener('click', function () {
        const selectedMood = moodOptions[moodSelect.value];
        
        fetchData(selectedMood.api, selectedMood.headers)
            .then(data => {
                displayData(data, selectedMood.label);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                activityText.textContent = 'Error fetching content. Please try again later.';
            });
    });

    // Function to fetch data from API without caching
    function fetchData(apiUrl, headers) {
        return fetch(apiUrl, { headers: headers || {} })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    }

    // Function to display data based on mood
    function displayData(data, mood) {
        if (mood === "Joke" && data.joke) {
            activityText.textContent = data.joke;
        } else if (mood === "Quote" && data.content && data.author) {
            activityText.textContent = `"${data.content}" - ${data.author}`;
        } else if (mood === "Random Fact" && data.text) {
            activityText.textContent = data.text;
        } else if (mood === "Dog Picture" && data.message) {
            activityText.innerHTML = `<img src="${data.message}" alt="Random Dog" loading="lazy">`;
        } else if (mood === "Cat Picture" && data[0] && data[0].url) {
            activityText.innerHTML = `<img src="${data[0].url}" alt="Random Cat" loading="lazy">`;
        } else if (mood === "Food Recipe" && data.meals && data.meals[0]) {
            const meal = data.meals[0];
            activityText.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
            `;
        } else if (mood === "Nature Image") {
            activityText.innerHTML = `<img src="${data}" alt="Random Nature Image" loading="lazy">`;
        } else {
            activityText.textContent = 'No content found for the selected option.';
        }

        updateStyles();
    }

    // Update background and text color for better readability
    function updateStyles() {
        const backgroundColor = getRandomColor();
        body.style.backgroundColor = backgroundColor;
        const textColor = isDarkColor(backgroundColor) ? 'white' : 'black';
        activityText.style.color = textColor;
    }

    // Generate random color for background
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Check if color is dark or light for text color adjustment
    function isDarkColor(color) {
        const rgb = hexToRgb(color);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness <= 128;
    }

    // Convert hex color to RGB format
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
});
