document.addEventListener('DOMContentLoaded', function() {
    // Fetch game data from JSON file
    fetch('freemobile_games_homepage_data.json')
        .then(response => response.json())
        .then(data => {
            displayGames(data.homepage.featured_games, 'featured-games');
            displayGames(data.homepage.latest_additions, 'latest-games');
            displayGames(data.homepage.top_rated_games, 'top-rated-games');
        })
        .catch(error => console.error('Error fetching game data:', error));

    // Function to create a game element
    function createGameElement(game) {
        const gameElement = document.createElement('div');
        gameElement.classList.add('game');
        gameElement.innerHTML = `
            <img src="${game.image_url}" alt="${game.title}" class="game-image">
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <p>Category: ${game.category}</p>
            <div class="download-links">
                ${game.download_links.Android ? `<a href="${game.download_links.Android}" target="_blank">Android</a>` : ''}
                ${game.download_links.iOS ? `<a href="${game.download_links.iOS}" target="_blank">iOS</a>` : ''}
            </div>
        `;
        return gameElement;
    }

    // Function to display games in a section
    function displayGames(games, sectionId) {
        const section = document.getElementById(sectionId);
        games.forEach(game => {
            section.appendChild(createGameElement(game));
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
                    ...data.homepage.featured_games,
                    ...data.homepage.latest_additions,
                    ...data.homepage.top_rated_games
                ];
                
                const searchResults = allGames.filter(game => 
                    game.title.toLowerCase().includes(searchTerm) || 
                    game.category.toLowerCase().includes(searchTerm) ||
                    game.description.toLowerCase().includes(searchTerm)
                );
                
                // Clear existing content
                document.getElementById('featured-games').innerHTML = '';
                document.getElementById('latest-games').innerHTML = '';
                document.getElementById('top-rated-games').innerHTML = '';
                
                // Display search results
                const searchResultsSection = document.getElementById('featured-games');
                searchResultsSection.innerHTML = '<h2>Search Results</h2>';
                displayGames(searchResults, 'featured-games');
            })
            .catch(error => console.error('Error fetching game data:', error));
    });
});
