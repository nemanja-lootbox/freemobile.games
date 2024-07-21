document.addEventListener('DOMContentLoaded', function() {
    // Fetch game data from JSON file
    fetch('freemobile_games_homepage_data.json')
        .then(response => response.json())
        .then(data => {
            displayGames(data.featured_games, 'featured-games', true);
            displayGames(data.top_rated_games, 'top-rated-games');
            displayCategories(data.categories);
            displayPopularGames(data.top_rated_games);
            displayLatestGames(data.latest_games);
        })
        .catch(error => console.error('Error fetching game data:', error));


    function displayPopularGames(games) {
        const popularGamesList = document.getElementById('popular-games-list');
        popularGamesList.innerHTML = ''; // Clear existing content
        games.slice(0, 10).forEach((game, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#">${index + 1}. ${game.title}</a>`;
            popularGamesList.appendChild(li);
        });
    }

    function displayLatestGames(games) {
        const latestGamesList = document.getElementById('latest-games-list');
        latestGamesList.innerHTML = ''; // Clear existing content
        games.forEach(game => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#"><img src="${game.image_url}" alt="${game.title}" class="game-icon"> ${game.title} - ${game.date}</a>`;
            latestGamesList.appendChild(li);
        });
    }

    // Function to create a game element
    function createGameElement(game, isFeatured = false) {
        const gameElement = document.createElement('div');
        gameElement.classList.add(isFeatured ? 'featured-game' : 'game');
        gameElement.innerHTML = `
            <h3>${game.title}</h3>
            <img src="${game.image_url || game.icon_url}" alt="${game.title}" class="${isFeatured ? 'featured-game-image' : 'game-icon'}">
            <p>${game.description || ''}</p>
            ${!isFeatured ? `
                <p>Category: ${game.category}</p>
                <p>Version: ${game.version}</p>
            ` : ''}
            <div class="download-links">
                ${game.download_links?.Android ? `<a href="${game.download_links.Android}" target="_blank">Android</a>` : ''}
                ${game.download_links?.iOS ? `<a href="${game.download_links.iOS}" target="_blank">iOS</a>` : ''}
            </div>
        `;
        return gameElement;
    }

    // Function to display games in a section
    function displayGames(games, sectionId, isFeatured = false) {
        const section = document.getElementById(sectionId);
        section.innerHTML = '';
        games.forEach(game => {
            section.appendChild(createGameElement(game, isFeatured));
        });
    }

    // Update the function calls in the fetch callback
    fetch('freemobile_games_homepage_data.json')
        .then(response => response.json())
        .then(data => {
            displayGames(data.featured_games, 'featured-games', true);
            displayGames(data.top_rated_games, 'top-rated-games');
            displayCategories(data.categories);
            displayLatestGames(data.latest_games);
            displayPopularGames(data.top_rated_games);
        })
        .catch(error => console.error('Error fetching game data:', error));

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
                    ...data.top_rated_games
                ];
                
                const searchResults = allGames.filter(game => 
                    game.title.toLowerCase().includes(searchTerm) || 
                    game.category.toLowerCase().includes(searchTerm) ||
                    (game.description && game.description.toLowerCase().includes(searchTerm))
                );
                
                // Clear existing content
                document.getElementById('featured-games').innerHTML = '';
                document.getElementById('latest-games-list').innerHTML = '';
                document.getElementById('top-rated-games-list').innerHTML = '';
                document.querySelector('.category-container').innerHTML = '';
                
                // Display search results
                const searchResultsSection = document.getElementById('featured-games');
                searchResultsSection.innerHTML = '<h2>Search Results</h2>';
                displayGames(searchResults, 'featured-games');
            })
            .catch(error => console.error('Error fetching game data:', error));
    });
});
