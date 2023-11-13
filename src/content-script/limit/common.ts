export type LimitReason = {
    cond: string
    type: LimitType
    allowDelay?: boolean
}

export type LimitType =
    | "DAILY"
    | "VISIT"
    | "PERIOD"

export interface MaskModal {
    addReason(reason: LimitReason): void
    removeReason(reason: LimitReason): void
    removeReasonsByType(type: LimitType): void
    removeReasonsByTypeAndCond(type: LimitType, cound: string): void
    addDelayHandler(handler: () => void): void
}

export type ModalContext = {
    url: string
    modal: MaskModal
}

export interface Processor {
    handleMsg(code: timer.mq.ReqCode, data: any): timer.mq.Response | Promise<timer.mq.Response>
    init(): void | Promise<void>
}