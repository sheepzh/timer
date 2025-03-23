import optionHolder from "@service/components/option-holder"

export default class IdleDetector {
    fullScreen: boolean = false

    autoPauseTracking: boolean = false
    // By milliseconds
    autoPauseInterval: number = -1

    lastActiveTime: number = Date.now()
    userActive: boolean = true
    pauseTimeout: NodeJS.Timeout | undefined

    onIdle: () => void
    onActive: () => void

    constructor({ onIdle, onActive }: { onIdle: () => void, onActive: () => void }) {
        this.onIdle = onIdle
        this.onActive = onActive
        this.init()
    }

    needTimeout(): boolean {
        return this.autoPauseTracking && this.autoPauseInterval > 0
    }

    isIdle() {
        return this.lastActiveTime + this.autoPauseInterval <= Date.now() && !this.fullScreen
    }

    private async init() {
        const option = await optionHolder.get()

        this.processOption(option)
        this.resetTimeout()

        optionHolder.addChangeListener(opt => {
            this.processOption(opt)
            this.resetTimeout()
        })

        const handleActive = () => {
            this.lastActiveTime = Date.now()

            if (!this.needTimeout()) return

            if (!this.pauseTimeout) {
                // Paused, so activate
                this.onActive?.()
                this.resetTimeout()
            }
        }

        window.addEventListener('mousedown', handleActive)
        window.addEventListener('mousemove', handleActive)
        window.addEventListener('keypress', handleActive)
        window.addEventListener('scroll', handleActive)
        window.addEventListener('wheel', handleActive)
        document?.addEventListener('fullscreenchange', () => {
            this.fullScreen = !!document?.fullscreenElement
            handleActive()
        })
    }

    private processOption(option: timer.option.StatisticsOption) {
        this.autoPauseTracking = !!option?.autoPauseTracking
        this.autoPauseInterval = option?.autoPauseInterval * 1000
    }

    private resetTimeout() {

        if (!!this.pauseTimeout) {
            clearTimeout(this.pauseTimeout)
            this.pauseTimeout = undefined
        }

        if (!this.needTimeout()) return

        const timeoutTs = this.lastActiveTime + this.autoPauseInterval
        const now = Date.now()

        const detectInterval = this.fullScreen
            ? this.autoPauseInterval
            : timeoutTs <= now ? this.autoPauseInterval : (timeoutTs - now)

        this.pauseTimeout = setTimeout(() => this.handleTimeout(), detectInterval)
    }

    private handleTimeout() {
        this.pauseTimeout = undefined

        if (!this.needTimeout()) return

        if (this.isIdle()) {
            // Idle interval meets
            this.onIdle?.()
        } else {
            this.resetTimeout()
        }
    }
}