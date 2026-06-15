const { createApp, ref, computed, watch, onMounted, onBeforeUnmount, nextTick } = Vue;

/* ================================================================
   PlayerPanel — layout shell with named slots
   ================================================================ */
const PlayerPanel = {
    template: `
        <main class="player" role="region" aria-label="Music Player">
            <slot name="heading"></slot>
            <slot></slot>
            <slot name="footer"></slot>
        </main>
    `
};

/* ================================================================
   PlayerControls — prev / play-pause / next
   Pure presentational: emits events, owns no playback logic
   ================================================================ */
const PlayerControls = {
    props: {
        disabled: Boolean,
        isPlaying: Boolean
    },
    emits: ["prev", "toggle", "next"],
    template: `
        <div class="controls" role="group" aria-label="Playback controls">
            <button
                type="button"
                :disabled="disabled"
                @click="$emit('prev')"
                aria-label="Previous track"
            >◀</button>
            <button
                type="button"
                class="play-button"
                :disabled="disabled"
                @click="$emit('toggle')"
                :aria-label="isPlaying ? 'Pause' : 'Play'"
            >
                {{ isPlaying ? "⏸" : "▶" }}
            </button>
            <button
                type="button"
                :disabled="disabled"
                @click="$emit('next')"
                aria-label="Next track"
            >▶</button>
        </div>
    `
};

/* ================================================================
   TrackList — renders playlist; scoped slot lets parent customise
   each row
   ================================================================ */
const TrackList = {
    props: {
        tracks: { type: Array, required: true },
        currentIndex: { type: Number, required: true }
    },
    emits: ["select"],
    methods: {
        selectTrack(index) {
            this.$emit("select", index);
        }
    },
    template: `
        <ul
            class="playlist"
            v-if="tracks.length"
            role="listbox"
            aria-label="Playlist"
        >
            <li
                v-for="(track, index) in tracks"
                :key="track.id"
                role="option"
                :aria-selected="index === currentIndex"
            >
                <slot
                    name="track"
                    :track="track"
                    :index="index"
                    :active="index === currentIndex"
                    :select="selectTrack"
                >
                    <button
                        type="button"
                        :class="{ active: index === currentIndex }"
                        @click="selectTrack(index)"
                    >
                        {{ track.name }}
                    </button>
                </slot>
            </li>
        </ul>
    `
};

/* ================================================================
   MusicPlayer — root component
   Fully Composition API.  Handles file loading, audio element,
   playback control, volume persistence, error feedback.
   ================================================================ */
const MusicPlayer = {
    components: { PlayerPanel, PlayerControls, TrackList },

    setup() {
        // ── reactive state ──────────────────────────────────────
        const tracks       = ref([]);
        const currentIndex = ref(0);
        const currentTime  = ref(0);
        const duration     = ref(0);
        const isPlaying    = ref(false);
        const isSeeking    = ref(false);
        const errorMessage = ref("");

        const audioRef     = ref(null);   // <audio> template ref

        // Volume — restore from localStorage; use null-check so 0 survives
        const storageOk = typeof localStorage !== "undefined";
        const saved     = storageOk ? localStorage.getItem("musicPlayerVolume") : null;
        const volume    = ref(saved !== null ? parseFloat(saved) : 0.8);

        // ── computed ────────────────────────────────────────────
        const currentTrack = computed(() => tracks.value[currentIndex.value] || null);
        const hasTracks    = computed(() => tracks.value.length > 0);
        const progressMax  = computed(() => duration.value || 100);

        // ── helpers ─────────────────────────────────────────────
        const formatTime = (seconds) => {
            if (!Number.isFinite(seconds)) return "0:00";
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60).toString().padStart(2, "0");
            return `${m}:${s}`;
        };

        // ── core playback ───────────────────────────────────────
        const loadCurrentTrack = (shouldPlay) => {
            const audio = audioRef.value;
            if (!audio || !currentTrack.value) return;

            audio.src    = currentTrack.value.url;
            audio.volume = volume.value;
            audio.load();
            currentTime.value = 0;
            errorMessage.value = "";

            if (shouldPlay) {
                audio.play().catch((err) => {
                    console.warn("Playback failed:", err);
                    isPlaying.value = false;
                    errorMessage.value = "Unable to play this track. Try a different file.";
                });
            }
        };

        const chooseFiles = (event) => {
            // 1) build new array FIRST (prevents orphaned ObjectURLs on error)
            const files     = Array.from(event.target.files);
            const newTracks = files.map((file, i) => ({
                id:   `${file.name}-${file.lastModified}-${i}`,
                name: file.name,
                url:  URL.createObjectURL(file)
            }));

            // 2) release old URLs, then swap
            tracks.value.forEach((t) => URL.revokeObjectURL(t.url));
            tracks.value       = newTracks;
            currentIndex.value = 0;
            currentTime.value  = 0;
            duration.value     = 0;
            isPlaying.value    = false;
            errorMessage.value = "";

            nextTick(() => loadCurrentTrack(false));
        };

        const togglePlay = () => {
            const audio = audioRef.value;
            if (!audio || !hasTracks.value) return;

            if (audio.paused) {
                audio.play().catch((err) => {
                    console.warn("Playback failed:", err);
                    isPlaying.value = false;
                    errorMessage.value = "Unable to play. Try a different file.";
                });
            } else {
                audio.pause();
            }
        };

        const playPrev = () => {
            if (!hasTracks.value) return;
            currentIndex.value =
                (currentIndex.value - 1 + tracks.value.length) % tracks.value.length;
            loadCurrentTrack(true);
        };

        const playNext = () => {
            if (!hasTracks.value) return;
            currentIndex.value = (currentIndex.value + 1) % tracks.value.length;
            loadCurrentTrack(true);
        };

        const selectTrack = (index) => {
            currentIndex.value = index;
            loadCurrentTrack(true);
        };

        // ── seeking ─────────────────────────────────────────────
        // isSeeking gate prevents syncTime from fighting the drag.
        // Actual seek fires on @change (mouse/touch release).
        const onSeekStart = () => {
            isSeeking.value = true;
        };

        const onSeekEnd = (event) => {
            isSeeking.value = false;
            const audio = audioRef.value;
            if (audio && hasTracks.value) {
                audio.currentTime = Number(event.target.value);
            }
        };

        // ── audio event callbacks ───────────────────────────────
        const updateDuration = () => {
            const audio = audioRef.value;
            duration.value = audio ? Math.floor(audio.duration) : 0;
        };

        const syncTime = () => {
            if (isSeeking.value) return;          // don't fight user drag
            const audio = audioRef.value;
            currentTime.value = audio ? Math.floor(audio.currentTime) : 0;
        };

        // ── watchers ────────────────────────────────────────────
        // Watch volume so we always write through to <audio> and
        // localStorage AFTER the ref has been updated (no more
        // v-model/@input ordering headache).
        watch(volume, (val) => {
            const audio = audioRef.value;
            if (audio) audio.volume = val;
            if (storageOk) localStorage.setItem("musicPlayerVolume", val);
        });

        // ── lifecycle ───────────────────────────────────────────
        onMounted(() => {
            const audio = audioRef.value;
            if (audio) audio.volume = volume.value;
        });

        onBeforeUnmount(() => {
            tracks.value.forEach((t) => URL.revokeObjectURL(t.url));
        });

        // ── template bindings ───────────────────────────────────
        return {
            tracks, currentIndex, currentTime, duration,
            volume, isPlaying, isSeeking, errorMessage,
            currentTrack, hasTracks, progressMax,
            formatTime, chooseFiles, loadCurrentTrack,
            togglePlay, playPrev, playNext, selectTrack,
            onSeekStart, onSeekEnd, updateDuration, syncTime,
            audioRef
        };
    },

    /* ------------------------------------------------------------
       Template
       ------------------------------------------------------------ */
    template: `
        <player-panel>
            <template #heading>
                <slot name="heading">
                    <h1>Music Player</h1>
                </slot>
            </template>

            <p class="track-name">
                <span v-if="currentTrack">{{ currentTrack.name }}</span>
                <slot v-else name="empty">Choose audio files</slot>
            </p>

            <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>

            <input
                type="file"
                accept="audio/*"
                multiple
                @change="chooseFiles"
            >

            <player-controls
                :disabled="!hasTracks"
                :is-playing="isPlaying"
                @prev="playPrev"
                @toggle="togglePlay"
                @next="playNext"
            />

            <input
                type="range"
                min="0"
                :max="progressMax"
                v-model.number="currentTime"
                :disabled="!hasTracks"
                @mousedown="onSeekStart"
                @touchstart="onSeekStart"
                @change="onSeekEnd"
            >

            <div class="time-row">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(duration) }}</span>
            </div>

            <label class="volume-row">
                <span>Volume</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    v-model.number="volume"
                >
            </label>

            <track-list
                :tracks="tracks"
                :current-index="currentIndex"
                @select="selectTrack"
            >
                <template #track="{ track, index, active, select }">
                    <button
                        type="button"
                        :class="{ active }"
                        @click="select(index)"
                    >
                        {{ index + 1 }}. {{ track.name }}
                    </button>
                </template>
            </track-list>

            <template #footer>
                <slot name="footer"></slot>
            </template>

            <audio
                ref="audioRef"
                @loadedmetadata="updateDuration"
                @timeupdate="syncTime"
                @play="isPlaying = true"
                @pause="isPlaying = false"
                @ended="playNext"
            />
        </player-panel>
    `
};

/* ================================================================
   Bootstrap
   ================================================================ */
createApp({
    components: { MusicPlayer }
}).mount("#app");
