import { useMainStore } from "~/stores/main";
export default defineNuxtRouteMiddleware(async (to, from) => {
    const mainStore = useMainStore();
    mainStore.toggleSidebar(false);
    mainStore.toggleLoader(true);
    setTimeout(() => {
        mainStore.toggleLoader(false);
    }, 1500);
})