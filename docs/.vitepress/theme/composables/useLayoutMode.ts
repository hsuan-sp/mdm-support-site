import { ref, onMounted, watch } from 'vue';

const isMobileView = ref(false); // The actual state used by components
const userPreference = ref<string | null>(null); // 'mobile' | 'desktop' | null

// Comprehensive Mobile Detection
const detectMobile = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Detect iOS (iPhone/iPod + iPad with touch)
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isIpadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0;
    
    // Detect Android
    const isAndroid = /android/i.test(ua);
    
    // Detect other mobile browsers
    const isMobileBrowser = /Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    
    // Check screen width as fallback (standard tablet breakpoint)
    const isSmallScreen = window.innerWidth <= 1200;

    return isIOS || isIpadOS || isAndroid || isMobileBrowser || isSmallScreen;
};

export function useLayoutMode() {
    
    const toggleLayout = () => {
        // Toggle logic: if identifying as mobile, switch to desktop preference, and vice versa.
        if (isMobileView.value) {
            userPreference.value = 'desktop';
            isMobileView.value = false;
        } else {
            userPreference.value = 'mobile';
            isMobileView.value = true;
        }
        localStorage.setItem('mdm-layout-preference', userPreference.value);
    };

    onMounted(() => {
        // 1. Load Preference
        const savedPref = localStorage.getItem('mdm-layout-preference');
        
        if (savedPref) {
            userPreference.value = savedPref;
            isMobileView.value = savedPref === 'mobile';
        } else {
            // 2. Auto-detect if no preference
            isMobileView.value = detectMobile();
        }

        // 3. Listen to resize only if no user preference overrides it
        window.addEventListener('resize', () => {
            if (!userPreference.value) {
                isMobileView.value = detectMobile();
            }
        });
    });

    return {
        isMobileView,
        toggleLayout
    };
}
