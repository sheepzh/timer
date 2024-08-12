export type LimitReason =
    & Required<Pick<timer.limit.Rule, 'id' | 'cond'>>
    & Pick<timer.limit.Item, 'allowDelay'>
    & Partial<Pick<timer.limit.Item, 'delayCount'>>
    & {
        type: LimitType
        getVisitTime?: () => number
    }

export type LimitType =
    | "DAILY"
    | "WEEKLY"
    | "VISIT"
    | "PERIOD"

export interface MaskModal {
    addReason(...reasons: LimitReason[]): void
    removeReason(...reasons: LimitReason[]): void
    removeReasonsByType(...types: LimitType[]): void
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