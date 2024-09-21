import optionService from "@service/option-service"

class AccessibilityHelper {
    private option: timer.option.AccessibilityOption = null

    public async getOption(): Promise<timer.option.AccessibilityOption> {
        if (this.option == null) {
            this.option = await optionService.getAllOption()
            optionService.addOptionChangeListener(val => this.option = val)
        }
        return this.option
    }
}

export default new AccessibilityHelper()