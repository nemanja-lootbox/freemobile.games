document.addEventListener('DOMContentLoaded', function() {
    // Fetch game data from JSON file
    fetch('freemobile_games_homepage_data.json')
        .then(response => response.json())
        .then(data => {
            displayFeaturedGames(data.featured_games);
            displayCategories(data.categories);
            displayLatestGames(data.latest_games);
            displayPopularGames(data.most_popular_games);
            displayTopRatedGames(data.top_rated_games);
        })
        .catch(error => console.error('Error fetching game data:', error));

    function displayPopularGames(games) {
        const popularGamesList = document.getElementById('most-popular-games-list');
        popularGamesList.innerHTML = ''; // Clear existing content
        games.forEach((game, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#">${index + 1}. <img src="${game.image_url}" alt="${game.title}" class="game-icon"> ${game.title}</a>`;
            popularGamesList.appendChild(li);
        });
    }

    function displayTopRatedGames(games) {
        const topRatedGamesList = document.getElementById('top-rated-games-list');
        topRatedGamesList.innerHTML = ''; // Clear existing content
        games.forEach(game => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#"><img src="${game.image_url}" alt="${game.title}" class="game-icon"> ${game.title}</a>`;
            topRatedGamesList.appendChild(li);
        });
    }

    function displayLatestGames(games) {
        const latestGamesList = document.getElementById('latest-games-list');
        latestGamesList.innerHTML = ''; // Clear existing content
        games.forEach(game => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#"><img src="${game.image_url}" alt="${game.title}" class="game-icon"> ${game.title}</a> <span class="game-date">${game.date}</span>`;
            latestGamesList.appendChild(li);
        });
    }

    function displayFeaturedGames(games) {
        const featuredGamesContainer = document.getElementById('featured-games');
        featuredGamesContainer.innerHTML = '';
        games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('featured-game-card');
            gameCard.innerHTML = `
                <h3>${game.title}</h3>
                <img src="${game.image_url}" alt="${game.title}" class="featured-game-image">
            `;
            featuredGamesContainer.appendChild(gameCard);
        });
    }

    // Function to display categories
    function displayCategories(categories) {
        const categoryContainer = document.querySelector('.category-container');
        categoryContainer.innerHTML = '';
        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.classList.add('category');
            categoryElement.innerHTML = `
                <h3>${category.name}</h3>
                <ul>
                    ${category.games.map(game => `
                        <li><img src="${game.image_url}" alt="${game.title}" class="game-icon"><a href="#">${game.title}</a></li>
                    `).join('')}
                </ul>
                <a href="#" class="view-more">View More</a>
            `;
            categoryContainer.appendChild(categoryElement);
        });
    }

    // Search functionality
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase();
        
        fetch('freemobile_games_homepage_data.json')
            .then(response => response.json())
            .then(data => {
                const allGames = [
                    ...data.featured_games,
                    ...data.latest_games,
                    ...data.most_popular_games,
                    ...data.top_rated_games
                ];
                
                const searchResults = allGames.filter(game => 
                    game.title.toLowerCase().includes(searchTerm) || 
                    game.category.toLowerCase().includes(searchTerm) ||
                    (game.description && game.description.toLowerCase().includes(searchTerm))
                );
                
                // Clear existing content
                document.getElementById('featured_games').innerHTML = '';
                document.getElementById('latest-games-list').innerHTML = '';
                document.getElementById('top-rated-games-list').innerHTML = '';
                document.getElementById('most-popular-games-list').innerHTML = '';
                document.querySelector('.category-container').innerHTML = '';
                
                // Display search results
                const searchResultsSection = document.getElementById('featured_games');
                searchResultsSection.innerHTML = '<h2>Search Results</h2>';
                displayGames(searchResults, 'featured_games');
            })
            .catch(error => console.error('Error fetching game data:', error));
    });
});
