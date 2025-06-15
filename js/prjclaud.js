document.addEventListener('DOMContentLoaded', () => {
    // Click to navigate to project page
    document.querySelectorAll('.project-item').forEach(item => {
        // Only trigger navigation when clicking on text, not video
        const projectText = item.querySelector('.project-text');
        if (projectText) {
            projectText.addEventListener('click', () => {
                const url = item.dataset.url;
                if (url) window.location.href = url;
            });
        }
    });

    // Enhanced hover effect for video expansion
    document.querySelectorAll('.project-item').forEach(item => {
        const video = item.querySelector('.hidden-video');
        if (video) {
            // Preload video
            video.load();
            
            item.addEventListener('mouseenter', () => {
                if (video.paused) {
                    video.play().catch(error => {
                        console.warn('Video autoplay failed:', error);
                    });
                }
            });

            item.addEventListener('mouseleave', () => {
                if (!video.paused) {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }
    });
});