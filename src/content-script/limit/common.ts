export type LimitReason = Pick<timer.limit.Rule, 'id' | 'cond' | 'allowDelay'>
    & {
        type: LimitType
    }

export type LimitType =
    | "DAILY"
    | "VISIT"
    | "PERIOD"

export interface MaskModal {
    addReason(reason: LimitReason): void
    removeReason(reason: LimitReason): void
    removeReasonsByType(type: LimitType): void
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