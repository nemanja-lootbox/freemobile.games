document.addEventListener('DOMContentLoaded', function() {
    // Fetch game data from JSON file
    fetch('freemobile_games_homepage_data.json')
        .then(response => response.json())
        .then(data => {
            displayGames(data.homepage.featured_games, 'featured-games');
            displayGames(data.homepage.latest_additions, 'latest-games');
            displayGames(data.homepage.top_rated_games, 'top-rated-games');
            displayCategories(data.homepage.categories);
            displayLatestGames(data.homepage.latest_additions);
            displayPopularGames(data.homepage.top_rated_games);
        })
        .catch(error => console.error('Error fetching game data:', error));

    function displayLatestGames(games) {
        const latestGamesList = document.getElementById('latest-games-list');
        games.slice(0, 10).forEach((game, index) => {
            const li = document.createElement('li');
            const date = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' });
            li.innerHTML = `<a href="#">${date} - ${game.title}</a>`;
            latestGamesList.appendChild(li);
        });
    }

    function displayPopularGames(games) {
        const popularGamesList = document.getElementById('popular-games-list');
        games.slice(0, 10).forEach((game, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#">${index + 1}. ${game.title}</a>`;
            popularGamesList.appendChild(li);
        });
    }

    // Function to create a game element
    function createGameElement(game) {
        const gameElement = document.createElement('div');
        gameElement.classList.add('game');
        gameElement.innerHTML = `
            <img src="${game.icon_url}" alt="${game.title}" class="game-icon">
            <h3>${game.title}</h3>
            <p>${game.description || ''}</p>
            <p>Category: ${game.category}</p>
            <p>Version: ${game.version}</p>
            <div class="download-links">
                ${game.download_links?.Android ? `<a href="${game.download_links.Android}" target="_blank">Android</a>` : ''}
                ${game.download_links?.iOS ? `<a href="${game.download_links.iOS}" target="_blank">iOS</a>` : ''}
            </div>
        `;
        return gameElement;
    }

    // Function to display games in a section
    function displayGames(games, sectionId) {
        const section = document.getElementById(sectionId);
        section.innerHTML = '';
        games.forEach(game => {
            section.appendChild(createGameElement(game));
        });
    }

    // Function to display categories
    function displayCategories(categories) {
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = '';
        Object.entries(categories).forEach(([category, games]) => {
            const categoryElement = document.createElement('div');
            categoryElement.classList.add('category');
            categoryElement.innerHTML = `
                <h3>${category}</h3>
                <div class="category-games">
                    ${games.map(game => `
                        <div class="category-game">
                            <img src="${game.icon_url}" alt="${game.title}" class="game-icon">
                            <p>${game.title}</p>
                            <p>Version: ${game.version}</p>
                        </div>
                    `).join('')}
                </div>
            `;
            categoryList.appendChild(categoryElement);
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
                    (game.description && game.description.toLowerCase().includes(searchTerm))
                );
                
                // Clear existing content
                document.getElementById('featured-games').innerHTML = '';
                document.getElementById('latest-games').innerHTML = '';
                document.getElementById('top-rated-games').innerHTML = '';
                document.getElementById('category-list').innerHTML = '';
                
                // Display search results
                const searchResultsSection = document.getElementById('featured-games');
                searchResultsSection.innerHTML = '<h2>Search Results</h2>';
                displayGames(searchResults, 'featured-games');
            })
            .catch(error => console.error('Error fetching game data:', error));
    });
});
