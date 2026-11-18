// ==========================================
// 1. HIYA'S PHOTOS LIST (Add as many as you want!)
// Put all of Hiya's photos inside the "photos/" folder
// ==========================================
const HIYA_PHOTOS = [
{ src: "photos/hiya1.jpg", tag: "Hiya", title: "My Favorite Smile", note: "One look at this and my whole mood changes." },
    { src: "photos/hiya2.jpg", tag: "Hiya", title: "Forever Wifey", note: "Here's to endless chapters ahead." },
    { src: "photos/hiya3.jpg", tag: "Hiya", title: "Sweetest Eyes", note: "Where I could get lost for hours." },
    { src: "photos/hiya4.jpg", tag: "Hiya", title: "Wifey Vibes", note: "Still can't believe you're mine, Hiya." },
    { src: "photos/hiya5.jpg", tag: "Hiya", title: "First Date Glow", note: "Finally seeing you in real life today." },
    { src: "photos/hiya6.jpg", tag: "Hiya", title: "After Aug 21", note: "Since our first chat on Instagram, everything shifted." },
    { src: "photos/hiya7.jpg", tag: "Hiya", title: "88 Days of You", note: "From friends to something so much deeper." },
    { src: "photos/hiya8.jpg", tag: "Hiya", title: "11 Days Together", note: "Short days, massive feelings." },
    { src: "photos/hiya9.jpg", tag: "Hiya", title: "Golden Frame", note: "Finally seeing you in real life today." },
    { src: "photos/hiya10.jpg", tag: "Hiya", title: "Unforgettable", note: "Saved in my heart forever." },
    { src: "photos/hiya11.jpg", tag: "Hiya", title: "Just Hiya", note: "My favorite person in every angle." },
    { src: "photos/hiya12.jpg", tag: "Hiya", title: "Pure Grace", note: "Effortlessly gorgeous in every single frame." }
    // Add more lines like this:
    // { src: "photos/hiya13.jpg", tag: "Hiya", title: "Title here", note: "Note here." },
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80";

const photoGrid = document.getElementById("photo-grid");
let currentIndex = 0;

function renderGallery() {
    photoGrid.innerHTML = "";
    HIYA_PHOTOS.forEach((item, idx) => {
        const card = document.createElement("div");
        card.className = `polaroid ${idx % 2 === 0 ? "tilt-left" : "tilt-right"}`;
        card.innerHTML = `
            <div class="pin"></div>
            <img src="${item.src}" alt="${item.title}">
            <div class="caption">
                <span class="day-tag">${item.tag}</span>
                <h3>${item.title}</h3>
                <p>${item.note}</p>
            </div>
        `;
        const imgEl = card.querySelector("img");
        imgEl.onerror = () => {
            imgEl.src = FALLBACK_IMG;
        };
        card.addEventListener("click", () => openLightbox(idx));
        photoGrid.appendChild(card);
    });
}
renderGallery();

// ==========================================
// 2. NON-STOP BACKGROUND MUSIC (MP3 + YouTube fallback)
// ==========================================
const YOUTUBE_VIDEO_ID = "1NBnN0IAljQ";
const bgAudio = document.getElementById("bg-audio");
const eq = document.getElementById("equalizer");
const statusText = document.getElementById("music-status");

let useLocalAudio = false;
let ytPlayer = null;
let isPlaying = false;

bgAudio.volume = 0.7;
bgAudio.loop = true;

// Check if local song.mp3 exists
fetch("song.mp3", { method: "HEAD" })
    .then((res) => {
        if (res.ok) useLocalAudio = true;
    })
    .catch(() => {
        useLocalAudio = false;
    });

// Extra loop guard for local audio
bgAudio.addEventListener("ended", () => {
    bgAudio.currentTime = 0;
    bgAudio.play().catch(() => {});
});

// Load YouTube IFrame API as fallback
const ytTag = document.createElement("script");
ytTag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(ytTag);

window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player("youtube-player", {
        height: "1",
        width: "1",
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
            autoplay: 0,
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID,
            controls: 0,
            playsinline: 1
        },
        events: {
            onReady: (e) => e.target.setVolume(70),
            onStateChange: (e) => {
                if (useLocalAudio) return;
                if (e.data === YT.PlayerState.PLAYING) {
                    setPlayingUI(true);
                } else if (e.data === YT.PlayerState.ENDED) {
                    ytPlayer.seekTo(0);
                    ytPlayer.playVideo();
                } else if (e.data === YT.PlayerState.PAUSED) {
                    setPlayingUI(false);
                }
            }
        }
    });
};

function setPlayingUI(playing) {
    isPlaying = playing;
    if (playing) {
        eq.classList.add("playing");
        statusText.innerText = "Playing (Loop)";
    } else {
        eq.classList.remove("playing");
        statusText.innerText = "Paused";
    }
}

function startMusic() {
    if (useLocalAudio) {
        bgAudio.play().then(() => setPlayingUI(true)).catch(() => {});
    } else if (ytPlayer && typeof ytPlayer.playVideo === "function") {
        ytPlayer.playVideo();
        setPlayingUI(true);
    }
}

function toggleMusic() {
    if (useLocalAudio) {
        if (bgAudio.paused) {
            bgAudio.play().then(() => setPlayingUI(true)).catch(() => {});
        } else {
            bgAudio.pause();
            setPlayingUI(false);
        }
    } else if (ytPlayer && typeof ytPlayer.pauseVideo === "function") {
        if (isPlaying) {
            ytPlayer.pauseVideo();
            setPlayingUI(false);
        } else {
            ytPlayer.playVideo();
            setPlayingUI(true);
        }
    }
}

document.getElementById("enter-btn").addEventListener("click", () => {
    document.getElementById("welcome-screen").classList.add("hidden");
    startMusic();
});

document.getElementById("music-toggle").addEventListener("click", toggleMusic);

// ==========================================
// 3. LOVE LETTER ENVELOPE
// ==========================================
const envelope = document.getElementById("envelope");
envelope.addEventListener("click", () => {
    if (!envelope.classList.contains("open")) {
        envelope.classList.add("open");
    }
});

// ==========================================
// 4. LIGHTBOX WITH NEXT / PREV
// ==========================================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");

function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("active");
}

function updateLightbox() {
    const item = HIYA_PHOTOS[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.onerror = () => {
        lightboxImg.src = FALLBACK_IMG;
    };
    lightboxCaption.innerHTML = `<strong>${item.title}</strong> — ${item.note}`;
}

function closeLightbox() {
    lightbox.classList.remove("active");
}

function nextPhoto(e) {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex + 1) % HIYA_PHOTOS.length;
    updateLightbox();
}

function prevPhoto(e) {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex - 1 + HIYA_PHOTOS.length) % HIYA_PHOTOS.length;
    updateLightbox();
}

document.getElementById("close-lightbox").addEventListener("click", closeLightbox);
document.getElementById("next-photo").addEventListener("click", nextPhoto);
document.getElementById("prev-photo").addEventListener("click", prevPhoto);
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "ArrowLeft") prevPhoto();
    if (e.key === "Escape") closeLightbox();
});

// ==========================================
// 5. FLOATING HEARTS
// ==========================================
setInterval(() => {
    const container = document.getElementById("floating-elements");
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerHTML = "❤";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 14 + 10) + "px";
    heart.style.animationDuration = (Math.random() * 6 + 7) + "s";
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 13000);
}, 900);