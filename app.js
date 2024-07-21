document.addEventListener('DOMContentLoaded', function() {
    // Sample game data (replace with actual data from your backend)
    const sampleGames = [
        { id: 1, title: 'Awesome Action Game', category: 'Action' },
        { id: 2, title: 'Puzzle Master', category: 'Puzzle' },
        { id: 3, title: 'Strategy Commander', category: 'Strategy' },
        { id: 4, title: 'Sports Challenge', category: 'Sports' },
        { id: 5, title: 'RPG Adventure', category: 'RPG' }
    ];

    // Function to create a game element
    function createGameElement(game) {
        const gameElement = document.createElement('div');
        gameElement.classList.add('game');
        gameElement.innerHTML = `
            <h3>${game.title}</h3>
            <p>Category: ${game.category}</p>
        `;
        return gameElement;
    }

    // Populate Latest Releases
    const latestSection = document.getElementById('latest');
    sampleGames.slice(0, 3).forEach(game => {
        latestSection.appendChild(createGameElement(game));
    });

    // Populate Most Popular Downloads
    const popularSection = document.getElementById('popular');
    sampleGames.slice(-3).forEach(game => {
        popularSection.appendChild(createGameElement(game));
    });

    // Search functionality
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase();
        const searchResults = sampleGames.filter(game => 
            game.title.toLowerCase().includes(searchTerm) || 
            game.category.toLowerCase().includes(searchTerm)
        );
        
        // Clear existing content
        latestSection.innerHTML = '<h2>Search Results</h2>';
        popularSection.innerHTML = '';

        // Display search results
        searchResults.forEach(game => {
            latestSection.appendChild(createGameElement(game));
        });
    });
});
