import { ref, onMounted, onUnmounted } from 'vue';

const isMobileView = ref(false);

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
    
    // Check screen width (standard tablet breakpoint)
    const isSmallScreen = window.innerWidth < 960;

    return isIOS || isIpadOS || isAndroid || isMobileBrowser || isSmallScreen;
};

export function useLayoutMode() {
    
    const updateLayout = () => {
        isMobileView.value = detectMobile();
    };

    onMounted(() => {
        updateLayout();
        window.addEventListener('resize', updateLayout);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateLayout);
    });

    return {
        isMobileView,
        toggleLayout: () => {} // Kept for compatibility but does nothing
    };
}
