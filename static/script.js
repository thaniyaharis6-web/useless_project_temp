/* ============================================================
   VIBE MISMATCH — Frontend Logic (Aesthetic Audio Lounge Edition)
   ============================================================ */

const screens = {
  landing: document.getElementById("screen-landing"),
  loading: document.getElementById("screen-loading"),
  result:  document.getElementById("screen-result"),
};

let currentMood = "";
let currentQuotes = [];
let currentQuoteIndex = 0;
let isAudioPlaying = true;
let ytPlayer = null;
let pendingVideoId = null;

// YouTube IFrame API Ready Callback
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player("yt-player-container", {
    height: "200",
    width: "200",
    videoId: pendingVideoId || "Yn2LwWTteFo",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      enablejsapi: 1,
      origin: window.location.origin
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
};

function onPlayerReady(event) {
  if (pendingVideoId) {
    ytPlayer.loadVideoById(pendingVideoId);
    ytPlayer.playVideo();
  }
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    setVisualizerState(true);
  } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    setVisualizerState(false);
  }
}

function onPlayerError(event) {
  console.warn("YouTube player fallback event:", event.data);
  // Keep visualizer running so the user still has an interactive aesthetic experience
  setVisualizerState(true);
}

function playYouTubeAudio(videoId) {
  pendingVideoId = videoId;
  if (ytPlayer && typeof ytPlayer.loadVideoById === "function") {
    try {
      ytPlayer.loadVideoById({ videoId: videoId });
      ytPlayer.playVideo();
    } catch (e) {
      console.warn("Failed to load video via API:", e);
    }
  } else {
    // If API hasn't loaded yet, build direct iframe fallback
    const container = document.getElementById("yt-player-container");
    container.innerHTML = `<iframe 
      id="yt-direct-iframe" 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&controls=0"
      allow="autoplay; encrypted-media"
      style="width:1px;height:1px;border:none;"></iframe>`;
  }
  setVisualizerState(true);
}

function setVisualizerState(playing) {
  isAudioPlaying = playing;
  const disc = document.getElementById("vinyl-disc");
  const bars = document.getElementById("audio-bars");
  const tag  = document.getElementById("player-status-tag");
  const icon = document.getElementById("ctrl-icon");
  const text = document.getElementById("ctrl-text");

  if (playing) {
    disc.classList.remove("paused");
    disc.classList.add("spinning");
    bars.classList.remove("paused");
    tag.textContent = "PLAYING AUDIO";
    tag.style.color = "#4ade80";
    icon.innerHTML = "&#9646;&#9646;";
    text.textContent = "Pause Audio";
  } else {
    disc.classList.add("paused");
    bars.classList.add("paused");
    tag.textContent = "AUDIO PAUSED";
    tag.style.color = "#f97316";
    icon.innerHTML = "&#9654;";
    text.textContent = "Resume Audio";
  }
}

function togglePlayPause() {
  if (!ytPlayer || typeof ytPlayer.getPlayerState !== "function") {
    setVisualizerState(!isAudioPlaying);
    return;
  }
  const state = ytPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo();
    setVisualizerState(false);
  } else {
    ytPlayer.playVideo();
    setVisualizerState(true);
  }
}

/* ---- Mood Card Selection ---- */
document.getElementById("mood-grid").addEventListener("click", (e) => {
  const card = e.target.closest(".mood-card");
  if (!card) return;
  const mood = card.dataset.mood;
  if (!mood) return;

  document.querySelectorAll(".mood-card").forEach((c) => c.classList.remove("selected"));
  card.classList.add("selected");

  setTimeout(() => submitMood(mood), 220);
});

/* ---- Text Input Submit ---- */
function submitTextMood() {
  const input = document.getElementById("mood-text");
  const text = input.value.trim();
  if (!text) {
    input.style.borderColor = "var(--accent2)";
    input.focus();
    setTimeout(() => (input.style.borderColor = ""), 800);
    return;
  }
  submitMood(text);
}

document.getElementById("mood-text").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitTextMood();
});

/* ---- Core Submit Flow ---- */
async function submitMood(mood) {
  showScreen("loading");
  startLoadingSequence();

  try {
    const resp = await fetch("/api/vibe-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood }),
    });

    if (!resp.ok) throw new Error("Server error " + resp.status);
    const data = await resp.json();
    await waitForLoadingFinish();
    showResult(data);
  } catch (err) {
    console.error(err);
    await waitForLoadingFinish();
    showResult({
      song: { title: "Kadhakalude Kanneer", artist: "Malayalam Mass Audio", youtube_id: "Yn2LwWTteFo" },
      caption: "\"Our servers also got overwhelmed by your complex psychological condition. Enjoy this track anyway.\"",
      bonus_quotes: [
        "\"Emotions detected. Modern science recommends turning it off and on again.\"",
        "\"Clinical finding: Too much overthinking, not enough bass drops.\""
      ],
      detected_mood: mood,
    });
  }
}

/* ---- Loading Sequence Animation ---- */
let loadingResolve = null;
let loadingDone    = false;

function startLoadingSequence() {
  loadingDone = false;
  const pb = document.getElementById("progress-bar");
  const statuses = [
    document.getElementById("status-1"),
    document.getElementById("status-2"),
    document.getElementById("status-3"),
  ];

  statuses.forEach((s) => {
    s.classList.remove("active", "done");
    s.classList.add("pending");
  });
  pb.style.width = "0%";

  const timings = [0, 800, 1600];
  const progresses = [33, 66, 95];

  timings.forEach((delay, i) => {
    setTimeout(() => {
      if (i > 0) {
        statuses[i - 1].classList.remove("active");
        statuses[i - 1].classList.add("done");
      }
      statuses[i].classList.remove("pending");
      statuses[i].classList.add("active");
      pb.style.width = progresses[i] + "%";
    }, delay);
  });

  setTimeout(() => {
    statuses.forEach((s) => {
      s.classList.remove("active");
      s.classList.add("done");
    });
    pb.style.width = "100%";
    loadingDone = true;
    if (loadingResolve) loadingResolve();
  }, 2500);
}

function waitForLoadingFinish() {
  if (loadingDone) return Promise.resolve();
  return new Promise((resolve) => {
    loadingResolve = resolve;
  });
}

/* ---- Show Result Screen ---- */
function showResult(data) {
  const { song, caption, bonus_quotes, detected_mood } = data;
  currentMood = detected_mood;
  currentQuotes = [caption, ...(bonus_quotes || [])];
  currentQuoteIndex = 0;

  const moodDetails = {
    angry:    { emoji: "🤬", badge: "RAGE PROTOCOL", tag: "Angry Mode Activated" },
    hyper:    { emoji: "⚡", badge: "HIGH ADRENALINE", tag: "Hyper Vibe Active" },
    romantic: { emoji: "🥰", badge: "DELUSION CLINIC", tag: "Romantic Frequencies" },
    sad:      { emoji: "💔", badge: "MELANCHOLY WARD", tag: "Rainy Climax Mode" },
    happy:    { emoji: "😁", badge: "SUSPICIOUS JOY", tag: "Over-Serotonin Detected" }
  };

  const meta = moodDetails[detected_mood] || { emoji: "🎧", badge: "AUDIO DOSE", tag: "Mood Audio Deck" };

  document.getElementById("diag-tag").textContent = `Emotion: ${detected_mood.toUpperCase()} • ${meta.tag}`;
  document.getElementById("rx-mood-badge").textContent = meta.badge;
  document.getElementById("rx-caption").textContent = caption;
  document.getElementById("vinyl-emoji").textContent = meta.emoji;
  document.getElementById("vinyl-format-tag").textContent = `${detected_mood.toUpperCase()} TAPE`;

  document.getElementById("song-title").textContent = song.title;
  document.getElementById("song-artist").textContent = song.artist;

  // Render Sarcastic Roast Quotes Wall
  renderRoastWall();

  // Play audio in background
  playYouTubeAudio(song.youtube_id);

  showScreen("result");

  // Shake result reveal
  setTimeout(() => {
    const rc = document.getElementById("result-content");
    rc.classList.add("shake");
    rc.addEventListener("animationend", () => rc.classList.remove("shake"), { once: true });
  }, 180);
}

function renderRoastWall() {
  const card = document.getElementById("roast-card-text");
  const chipsContainer = document.getElementById("roast-chips-container");
  
  if (currentQuotes.length > 0) {
    card.innerHTML = `&ldquo;${currentQuotes[currentQuoteIndex]}&rdquo;`;
  }

  chipsContainer.innerHTML = "";
  currentQuotes.forEach((quote, idx) => {
    const chip = document.createElement("div");
    chip.className = `roast-chip ${idx === currentQuoteIndex ? "active" : ""}`;
    chip.textContent = `Diagnosis #${idx + 1}`;
    chip.onclick = () => selectRoast(idx);
    chipsContainer.appendChild(chip);
  });
}

function selectRoast(idx) {
  currentQuoteIndex = idx;
  const card = document.getElementById("roast-card-text");
  card.style.opacity = "0";
  setTimeout(() => {
    card.innerHTML = `&ldquo;${currentQuotes[currentQuoteIndex]}&rdquo;`;
    card.style.opacity = "1";
    document.querySelectorAll(".roast-chip").forEach((chip, i) => {
      chip.classList.toggle("active", i === currentQuoteIndex);
    });
  }, 150);
}

function cycleNextRoast() {
  if (!currentQuotes || currentQuotes.length === 0) return;
  currentQuoteIndex = (currentQuoteIndex + 1) % currentQuotes.length;
  selectRoast(currentQuoteIndex);
}

/* ---- Screen Transitions ---- */
function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    if (key === name) {
      el.classList.remove("slide-out");
      el.classList.add("active");
    } else if (el.classList.contains("active")) {
      el.classList.add("slide-out");
      el.classList.remove("active");
    }
  });
}

/* ---- Restart Flow ---- */
function restart() {
  // Pause audio
  if (ytPlayer && typeof ytPlayer.pauseVideo === "function") {
    try { ytPlayer.pauseVideo(); } catch (e) {}
  }
  setVisualizerState(false);

  // Clear inputs
  document.getElementById("mood-text").value = "";
  document.querySelectorAll(".mood-card").forEach((c) => c.classList.remove("selected"));

  showScreen("landing");
}
