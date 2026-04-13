const API_BASE = 'http://localhost:5268';

const { createApp } = Vue;

createApp({
    data() {
        return {
            records: [],
            loading: true,
            error: null,
            searchTitle: '',
            searchArtist: '',
        };
    },
    mounted() {
        this.fetchRecords();
    },
    methods: {
        async fetchRecords() {
            try {
                const params = {};
                if (this.searchTitle) params.title = this.searchTitle;
                if (this.searchArtist) params.artist = this.searchArtist;
                const response = await axios.get(`${API_BASE}/api/musicrecords`, { params });
                this.records = response.data;
            } catch (err) {
                this.error = 'Could not load music records. Is the API running?';
            } finally {
                this.loading = false;
            }
        },
        formatDuration(seconds) {
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return `${m}:${String(s).padStart(2, '0')}`;
        },
    },
}).mount('#app');
