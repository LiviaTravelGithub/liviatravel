import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => ({
        showLoader: true,
        isLoggedIn: false,
        layoutName: 'default'
    }),
    actions: {
        toggleLoader(value) {
            this.showLoader = value !== undefined ? value : !this.showLoader
        },
        toggleLogin(value) {
            this.isLoggedIn = value
        },
        setLayoutName(value) {
            this.layoutName = value
        }
    }
})