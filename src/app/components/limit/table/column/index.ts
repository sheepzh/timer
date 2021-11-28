import cond from "./cond"
import waste from "./waste"
import time from "./time"
import enabled from "./enabled"
import delay from './delay'
import operations from "./operation"
import { QueryData } from "../../../common/constants"

const _default = (queryData: QueryData) => [cond(), time(), waste(), delay(), enabled(), operations(queryData)]

export default _default