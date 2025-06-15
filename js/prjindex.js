document.addEventListener('DOMContentLoaded', () => {
    // Click to navigate to project page
    document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('click', () => {
            const url = item.dataset.url;
            if (url) window.location.href = url;
        });
    });

    // Hover effect for video expansion with error handling
    document.querySelectorAll('.project-item').forEach(item => {
        const video = item.querySelector('video');
        if (video) {
            video.load(); // Reset video
            video.addEventListener('canplay', () => {
                item.addEventListener('mouseover', () => {
                    if (video.paused) {
                        video.play().catch(error => console.error('Video play failed:', error));
                    }
                });

                item.addEventListener('mouseout', () => {
                    if (!video.paused) {
                        video.pause();
                        video.currentTime = 0;
                    }
                });
            }, { once: true });
        }
    });
});
