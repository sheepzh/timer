import { getCssVariable } from "@util/style"
import { ZRColor } from "echarts/types/dist/shared"

export const echartsPalette: () => ZRColor[] = () => [
    getCssVariable("--el-color-primary"),
    getCssVariable("--el-color-success"),
    getCssVariable("--el-color-warning"),
    getCssVariable("--el-color-danger"),
]
