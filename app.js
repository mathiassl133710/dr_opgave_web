const API_BASE = 'http://localhost:5268';

const { createApp } = Vue;

createApp({
    data() {
        return {
            token: localStorage.getItem('token') || null,
            username: localStorage.getItem('username') || '',
            password: '',
            loginError: null,
            records: [],
            loading: false,
            error: null,
            searchTitle: '',
            searchArtist: '',
        };
    },
    mounted() {
        if (this.token) {
            this.fetchRecords();
        }
    },
    methods: {
        async login() {
            this.loginError = null;
            try {
                const response = await axios.post(`${API_BASE}/api/auth/login`, {
                    username: this.username,
                    password: this.password,
                });
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
                localStorage.setItem('username', this.username);
                this.password = '';
                this.fetchRecords();
            } catch {
                this.loginError = 'Invalid username or password.';
            }
        },
        logout() {
            this.token = null;
            this.username = '';
            this.records = [];
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        },
        async fetchRecords() {
            this.loading = true;
            this.error = null;
            try {
                const params = {};
                if (this.searchTitle) params.title = this.searchTitle;
                if (this.searchArtist) params.artist = this.searchArtist;
                const response = await axios.get(`${API_BASE}/api/musicrecords`, {
                    params,
                    headers: { Authorization: `Bearer ${this.token}` },
                });
                this.records = response.data;
            } catch (err) {
                if (err.response?.status === 401) {
                    this.logout();
                } else {
                    this.error = 'Could not load music records. Is the API running?';
                }
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
