import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => ({
        showLoader: true,
        isLoggedIn: false,
        layoutName: 'default',
        rezervationVisible: false,
        rezervationOffer: null,
        rezervationTour: null,
        offerType: null,
        rezervationData: {
            lastName: "",
            firstName: "",
            email: "",
            phone: "",
            adults: 1,
            rooms: 1,
            children: 0,
            date: "",
        },
        tourRezervation: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            adults: 1,
            children: 0,
        },
        sidebarOpen: false,
        dbRezervations: [],
        dbTourRezervations: [],
        appReady: false
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
        },
        setRezervationVisible(visible) {
            this.rezervationVisible = visible
        },
        setOffer(offer) {
            localStorage.setItem('rezervationOffer', JSON.stringify(offer))
            this.rezervationOffer = offer
        },
        setTour(tour) {
            localStorage.setItem('rezervationTour', JSON.stringify(tour))
            this.rezervationTour = tour
        },
        setRezervationData(data) {
            this.rezervationData[data.key] = data.value
        },
        setOfferType(type) {
            this.offerType = type
            localStorage.setItem('offerType', type)
        },
        toggleSidebar(value) {
            this.sidebarOpen = value
        }
    }
})