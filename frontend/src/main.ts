// import './assets/main.css'
import './style.css'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'light',
            cssLayer: false
        }
    }
});
app.mount('#app')
