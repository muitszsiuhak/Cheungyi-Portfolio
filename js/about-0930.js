document.addEventListener('DOMContentLoaded', () => {
    // Get all cards and images
    const cards = document.querySelectorAll('.card');
    const cardCloud = document.querySelector('.card-cloud');
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingBar = document.querySelector('.loading-bar');
    const loadingProgress = document.querySelector('.loading-progress');
    
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
    
    // FIXED: Image preloading with proper error handling
    let loadedImages = 0;
    const totalImages = cards.length;
    const imagePromises = [];
    
    // Preload all images with robust error handling
    cards.forEach((card, index) => {
        const img = card.querySelector('img');
        const imageUrl = img.src;
        
        const imagePromise = new Promise((resolve) => {
            const preloadImg = new Image();
            preloadImg.onload = () => {
                loadedImages++;
                const progress = (loadedImages / totalImages) * 100;
                loadingProgress.style.width = progress + '%';
                resolve();
            };
            preloadImg.onerror = () => {
                loadedImages++;
                const progress = (loadedImages / totalImages) * 100;
                loadingProgress.style.width = progress + '%';
                console.warn('Failed to load image:', imageUrl);
                resolve();
            };
            preloadImg.src = imageUrl;
        });
        
        imagePromises.push(imagePromise);
    });
    
    // FIXED: Wait for all images to load with guaranteed progression
    Promise.all(imagePromises).then(() => {
        // Small delay to ensure smooth transition
        setTimeout(() => {
            startStarShootingAnimation();
        }, 500);
    }).catch((error) => {
        console.error('Error loading images:', error);
        // Start animation anyway after timeout
        setTimeout(() => {
            startStarShootingAnimation();
        }, 500);
    });
    
    // Add a safety timeout to prevent infinite loading
    setTimeout(() => {
        if (loadingScreen.style.display !== 'none') {
            console.warn('Loading timeout - forcing start of animation');
            startStarShootingAnimation();
        }
    }, 8000); // 8 second safety timeout
    
    function startStarShootingAnimation() {
        // Hide loading screen
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
        
        // Group cards by depth layers for sequential appearance
        const cardsByDepth = {};
        cards.forEach((card, index) => {
            // Assign random depth between 0.3 and 1.5
            const depth = 0.3 + Math.random() * 1.2;
            card.dataset.depth = depth;
            card.style.zIndex = Math.floor(depth * 10);
            
            // Group by depth ranges
            const depthLayer = Math.floor(depth * 3); // 0, 1, 2
            if (!cardsByDepth[depthLayer]) {
                cardsByDepth[depthLayer] = [];
            }
            cardsByDepth[depthLayer].push(card);
            
            // Set initial state for star shooting animation
            card.style.opacity = '0';
            card.style.transform = 'translate(-50vw, -50vh) scale(0.1)';
            card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        // Animate cards layer by layer
        Object.keys(cardsByDepth).sort().forEach((layer, layerIndex) => {
            setTimeout(() => {
                cardsByDepth[layer].forEach((card, cardIndex) => {
                    setTimeout(() => {
                        // Get original position
                        const originalTop = card.style.top;
                        const originalLeft = card.style.left;
                        
                        // Animate to original position
                        card.style.opacity = '0.45';
                        card.style.transform = 'translate(0, 0) scale(1)';
                        
                        // Add a subtle bounce effect
                        setTimeout(() => {
                            card.style.transform = 'translate(0, 0) scale(1.05)';
                            setTimeout(() => {
                                card.style.transform = 'translate(0, 0) scale(1)';
                            }, 100);
                        }, 600);
                        
                    }, cardIndex * 100); // Stagger within layer
                });
            }, layerIndex * 400); // Delay between layers
        });
        
        // Start the spatial effects after animation completes
        setTimeout(() => {
            initializeSpatialEffects();
        }, 2000);
    }
    
    function initializeSpatialEffects() {
        // Mouse tracking for spatial effect
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            
            if (!isDragging) {
                targetCloudX = mouseX * 8;
                targetCloudY = mouseY * 8;
            }
        });
        
        // Start animation loop
        animate();
        
        // Initialize drag functionality
        initializeDragFunctionality();
        
        // Initialize hover functionality
        initializeHoverFunctionality();
    }
    
    // Smooth animation loop for spatial effect
    function animate() {
        // Smooth interpolation towards target position
        cloudX += (targetCloudX - cloudX) * 0.05;
        cloudY += (targetCloudY - cloudY) * 0.05;
        
        // Apply layered parallax to individual cards
        cards.forEach((card, index) => {
            const depth = parseFloat(card.dataset.depth);
            
            // Each card moves at different speed based on its depth
            const cardMouseX = mouseX * 15 * depth;
            const cardMouseY = mouseY * 15 * depth;
            
            // Add subtle rotation for more spatial feel
            const rotation = (mouseX * depth * 2) + (mouseY * depth * 1);
            
            // Apply transform - include scale when hovering
            if (card.matches(':hover')) {
                card.style.transform = `translate(${cardMouseX}px, ${cardMouseY}px) rotate(${rotation}deg) scale(1.1)`;
            } else {
                card.style.transform = `translate(${cardMouseX}px, ${cardMouseY}px) rotate(${rotation}deg)`;
            }
        });
        
        // Apply cloud-wide transform
        cardCloud.style.transform = `translate(${cloudX}px, ${cloudY}px)`;
        
        requestAnimationFrame(animate);
    }
    
    // Drag functionality
    function initializeDragFunctionality() {
        const isMobile = window.innerWidth <= 768;
        const maxDrag = isMobile ? window.innerWidth * 2 : 200; // Allow more panning on mobile
        
        // Center canvas on mobile
        if (isMobile) {
            cloudX = -(window.innerWidth * 2 - window.innerWidth) / 2;
            targetCloudX = cloudX;
            cardCloud.style.transform = `translate(${cloudX}px, ${cloudY}px)`;
        }
        
        // Mouse drag for desktop
        cardCloud.addEventListener('mousedown', (e) => {
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

        // Touch drag (two-finger panning) for mobile
        cardCloud.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2 && !e.target.closest('.card')) {
                isDragging = true;
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const avgX = (touch1.clientX + touch2.clientX) / 2;
                const avgY = (touch1.clientY + touch2.clientY) / 2;
                dragStartX = avgX - cloudX;
                dragStartY = avgY - cloudY;
                cardCloud.classList.add('dragging');
                e.preventDefault();
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const avgX = (touch1.clientX + touch2.clientX) / 2;
                const avgY = (touch1.clientY + touch2.clientY) / 2;
                targetCloudX = cloudX = avgX - dragStartX;
                targetCloudY = cloudY = avgY - dragStartY;
                
                // Limit the drag range
                targetCloudX = Math.max(-maxDrag, Math.min(maxDrag, targetCloudX));
                targetCloudY = Math.max(-maxDrag, Math.min(maxDrag, targetCloudY));
                e.preventDefault();
            }
        });

        document.addEventListener('touchend', (e) => {
            if (isDragging && e.touches.length < 2) {
                isDragging = false;
                cardCloud.classList.remove('dragging');
            }
        });
    }
    
    // Hover functionality for project grouping
    function initializeHoverFunctionality() {
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const projectId = card.dataset.project;
                const projectCards = document.querySelectorAll(`[data-project="${projectId}"]`);
                
                projectCards.forEach(projectCard => {
                    projectCard.classList.add('project-highlighted');
                });
            });

            card.addEventListener('mouseleave', () => {
                const projectId = card.dataset.project;
                const projectCards = document.querySelectorAll(`[data-project="${projectId}"]`);
                
                projectCards.forEach(projectCard => {
                    projectCard.classList.remove('project-highlighted');
                });
            });

            // Add click functionality to cards
            card.addEventListener('click', () => {
                const projectId = card.dataset.project;
                const caption = card.querySelector('.caption').textContent;
                console.log(`Clicked on: ${caption} (Project: ${projectId})`);
                
                window.location.href = `${projectId}.html`;
            });
        });
    }
});