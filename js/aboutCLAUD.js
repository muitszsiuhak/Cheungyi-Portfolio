document.addEventListener('DOMContentLoaded', () => {
    // Fade-in animation for cards
    const cards = document.querySelectorAll('.card');
    const cardCloud = document.querySelector('.card-cloud');
    
    // Spatial effect variables
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let cloudX = 0;
    let cloudY = 0;
    let targetCloudX = 0;
    let targetCloudY = 0;
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 150); // Staggered fade-in (150ms delay per card)
    });

    // Mouse tracking for spatial effect
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        
        if (!isDragging) {
            // Subtle mouse following effect (very gentle)
            targetCloudX = mouseX * 8; // Reduced base movement
            targetCloudY = mouseY * 8;
        }
    });

    // Assign random depth layers to cards for parallax effect
    cards.forEach((card, index) => {
        // Assign random depth between 0.3 and 1.5 (closer = faster movement)
        const depth = 0.3 + Math.random() * 1.2;
        card.dataset.depth = depth;
        
        // Add subtle random z-index variation for visual layering
        card.style.zIndex = Math.floor(depth * 10);
    });

    // Smooth animation loop for spatial effect
    function animate() {
        // Smooth interpolation towards target position
        cloudX += (targetCloudX - cloudX) * 0.05;
        cloudY += (targetCloudY - cloudY) * 0.05;
        
        // Apply layered parallax to individual cards
        cards.forEach((card, index) => {
            const depth = parseFloat(card.dataset.depth);
            
            // Each card moves at different speed based on its depth
            const cardMouseX = mouseX * 15 * depth; // Depth affects movement intensity
            const cardMouseY = mouseY * 15 * depth;
            
            // Add subtle rotation for more spatial feel
            const rotation = (mouseX * depth * 2) + (mouseY * depth * 1);
            
            // Apply transform - include scale when hovering
            if (card.matches(':hover')) {
            // When hovering, apply scale along with the spatial transforms
                card.style.transform = `translate(${cardMouseX}px, ${cardMouseY}px) rotate(${rotation}deg) scale(1.1)`;
            } else {
                // When not hovering, just apply spatial transforms
                card.style.transform = `translate(${cardMouseX}px, ${cardMouseY}px) rotate(${rotation}deg)`;
            }
        });
        
        // Apply cloud-wide transform
        cardCloud.style.transform = `translate(${cloudX}px, ${cloudY}px)`;
        
        requestAnimationFrame(animate);
    }
    animate();

    // Drag functionality
    cardCloud.addEventListener('mousedown', (e) => {
        // Only start dragging if not clicking on a card
        if (!e.target.closest('.card')) {
            isDragging = true;
            dragStartX = e.clientX - cloudX;
            dragStartY = e.clientY - cloudY;
            cardCloud.classList.add('dragging');
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            targetCloudX = cloudX = e.clientX - dragStartX;
            targetCloudY = cloudY = e.clientY - dragStartY;
            
            // Limit the drag range
            const maxDrag = 200;
            targetCloudX = Math.max(-maxDrag, Math.min(maxDrag, targetCloudX));
            targetCloudY = Math.max(-maxDrag, Math.min(maxDrag, targetCloudY));
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            cardCloud.classList.remove('dragging');
        }
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

        // Add click functionality to cards - link to project pages
        card.addEventListener('click', () => {
            const projectId = card.dataset.project;
            const caption = card.querySelector('.caption').textContent;
            console.log(`Clicked on: ${caption} (Project: ${projectId})`);
            
            // Navigate to the corresponding project page
            window.location.href = `${projectId}.html`;
        });
    });
});