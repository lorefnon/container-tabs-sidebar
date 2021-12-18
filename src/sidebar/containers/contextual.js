import VerticalContainer from "./vertical.js"

export default class ContextualIdentityContainer extends VerticalContainer {
    constructor(id, window, config, sessionStorage, contextualIdentity) {
        super(id, window, config, sessionStorage)
        this.contextualIdentity = contextualIdentity
    }

    init() {
        super.init()
    }

    _handleTabCreated(newTab) {
        if (newTab.cookieStoreId !== this.id) return
        super._handleTabCreated(newTab)
    }

    async _actionNewTab(options = {}) {
        await super._actionNewTab(options)
        await browser.tabs.create({
            ...options,
            cookieStoreId: this.id,
        })
    }

    refresh(contextualIdentity) {
        this.contextualIdentity = contextualIdentity
        this.render(false)
    }

    async _queryTabs() {
        return await browser.tabs.query({
            currentWindow: true,
            cookieStoreId: this.id,
            pinned: false,
        })
    }

    get title() {
        return this.contextualIdentity.name
    }

    get _faviconURL() {
        return `/assets/contextual-identities/${this.contextualIdentity.icon}.svg#${this.contextualIdentity.color}`
    }

    async render(renderTabs) {
        this.elements.containerHeader.style.borderLeftColor =
            this.contextualIdentity.colorCode
        this.elements.icon.style.fill = this.contextualIdentity.colorCode
        return await super.render(renderTabs)
    }

    supportsCookieStore(cookieStoreId) {
        return this.id === cookieStoreId
    }

    async updateContextualIdentity(contextualIdentity) {
        this.contextualIdentity = contextualIdentity
        await this.render(false)
    }
}
