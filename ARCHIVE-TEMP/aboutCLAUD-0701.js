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

    // Hover functionality for project grouping
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const projectId = card.dataset.project;
            const projectCards = document.querySelectorAll(`[data-project="${projectId}"]`);
            
            // Make all cards of the same project fully opaque
            projectCards.forEach(projectCard => {
                projectCard.classList.add('project-highlighted');
            });
        });

        card.addEventListener('mouseleave', () => {
            const projectId = card.dataset.project;
            const projectCards = document.querySelectorAll(`[data-project="${projectId}"]`);
            
            // Remove highlight from all cards of the same project
            projectCards.forEach(projectCard => {
                projectCard.classList.remove('project-highlighted');
            });
        });

        // Add click functionality to cards (optional - for future project pages)
        card.addEventListener('click', () => {
            const projectId = card.dataset.project;
            const caption = card.querySelector('.caption').textContent;
            console.log(`Clicked on: ${caption}`);
            
            // Navigate to the corresponding project page
            window.location.href = `${projectId}.html`;
        });
    });
});