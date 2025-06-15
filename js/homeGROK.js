document.addEventListener('DOMContentLoaded', () => {
    // Fade-in animation for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 150); // Staggered fade-in (150ms delay per card)
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.filter;
            
            cards.forEach(card => {
                const cardCategories = card.dataset.category.split(' ');
                if (category === 'all' || cardCategories.includes(category)) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                }
            });
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Add click functionality to cards (optional - for future project pages)
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const caption = card.querySelector('.caption').textContent;
            console.log(`Clicked on: ${caption}`);
            // Add navigation logic here when project pages are ready
        });
    });
});