import Logger, { TimerLogger } from './logger'

declare global {
    interface Window {
        timer: TimerLogger
    }
}

/**
 * Manually open and close the log
 * 
 * @since 0.0.8
 */
window.timer = Logger
