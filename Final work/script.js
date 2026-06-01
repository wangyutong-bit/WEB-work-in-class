const { createApp } = Vue;

const PlayerPanel = {
    template: `
        <main class="player">
            <slot name="heading"></slot>
            <slot></slot>
            <slot name="footer"></slot>
        </main>
    `
};

const PlayerControls = {
    props: {
        disabled: Boolean,
        isPlaying: Boolean
    },
    emits: ["prev", "toggle", "next"],
    template: `
        <div class="controls">
            <button type="button" :disabled="disabled" @click="$emit('prev')">Prev</button>
            <button
                type="button"
                class="play-button"
                :disabled="disabled"
                @click="$emit('toggle')"
            >
                {{ isPlaying ? "Pause" : "Play" }}
            </button>
            <button type="button" :disabled="disabled" @click="$emit('next')">Next</button>
        </div>
    `
};

const TrackList = {
    props: {
        tracks: {
            type: Array,
            required: true
        },
        currentIndex: {
            type: Number,
            required: true
        }
    },
    emits: ["select"],
    methods: {
        selectTrack(index) {
            this.$emit("select", index);
        }
    },
    template: `
        <ul class="playlist" v-if="tracks.length">
            <li v-for="(track, index) in tracks" :key="track.id">
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

const MusicPlayer = {
    components: {
        PlayerPanel,
        PlayerControls,
        TrackList
    },
    data() {
        return {
            tracks: [],
            currentIndex: 0,
            currentTime: 0,
            duration: 0,
            volume: 0.8,
            isPlaying: false
        };
    },
    computed: {
        currentTrack() {
            return this.tracks[this.currentIndex] || null;
        },
        hasTracks() {
            return this.tracks.length > 0;
        },
        progressMax() {
            return this.duration || 100;
        }
    },
    methods: {
        formatTime(seconds) {
            if (!Number.isFinite(seconds)) {
                return "0:00";
            }

            const minutes = Math.floor(seconds / 60);
            const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
            return `${minutes}:${rest}`;
        },
        chooseFiles(event) {
            this.tracks.forEach((track) => URL.revokeObjectURL(track.url));
            this.tracks = Array.from(event.target.files).map((file, index) => ({
                id: `${file.name}-${file.lastModified}-${index}`,
                name: file.name,
                url: URL.createObjectURL(file)
            }));

            this.currentIndex = 0;
            this.currentTime = 0;
            this.duration = 0;
            this.isPlaying = false;

            this.$nextTick(() => {
                this.loadCurrentTrack(false);
            });
        },
        loadCurrentTrack(shouldPlay) {
            const audio = this.$refs.audio;

            if (!audio || !this.currentTrack) {
                return;
            }

            audio.src = this.currentTrack.url;
            audio.volume = this.volume;
            audio.load();
            this.currentTime = 0;

            if (shouldPlay) {
                audio.play().catch(() => {
                    this.isPlaying = false;
                });
            }
        },
        togglePlay() {
            const audio = this.$refs.audio;

            if (!audio || !this.hasTracks) {
                return;
            }

            if (audio.paused) {
                audio.play().catch(() => {
                    this.isPlaying = false;
                });
            } else {
                audio.pause();
            }
        },
        playPrev() {
            if (!this.hasTracks) {
                return;
            }

            this.currentIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
            this.loadCurrentTrack(true);
        },
        playNext() {
            if (!this.hasTracks) {
                return;
            }

            this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
            this.loadCurrentTrack(true);
        },
        selectTrack(index) {
            this.currentIndex = index;
            this.loadCurrentTrack(true);
        },
        seek() {
            const audio = this.$refs.audio;

            if (audio && this.hasTracks) {
                audio.currentTime = this.currentTime;
            }
        },
        setVolume() {
            const audio = this.$refs.audio;

            if (audio) {
                audio.volume = this.volume;
            }
        },
        updateDuration() {
            const audio = this.$refs.audio;
            this.duration = audio ? Math.floor(audio.duration) : 0;
        },
        syncTime() {
            const audio = this.$refs.audio;
            this.currentTime = audio ? Math.floor(audio.currentTime) : 0;
        }
    },
    mounted() {
        this.setVolume();
    },
    beforeUnmount() {
        this.tracks.forEach((track) => URL.revokeObjectURL(track.url));
    },
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

            <input type="file" accept="audio/*" multiple @change="chooseFiles">

            <player-controls
                :disabled="!hasTracks"
                :is-playing="isPlaying"
                @prev="playPrev"
                @toggle="togglePlay"
                @next="playNext"
            ></player-controls>

            <input
                type="range"
                min="0"
                :max="progressMax"
                v-model.number="currentTime"
                :disabled="!hasTracks"
                @input="seek"
            >

            <div class="time-row">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(duration) }}</span>
            </div>

            <label class="volume-row">
                Volume
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    v-model.number="volume"
                    @input="setVolume"
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
                ref="audio"
                @loadedmetadata="updateDuration"
                @timeupdate="syncTime"
                @play="isPlaying = true"
                @pause="isPlaying = false"
                @ended="playNext"
            ></audio>
        </player-panel>
    `
};

createApp({
    components: {
        MusicPlayer
    }
}).mount("#app");
