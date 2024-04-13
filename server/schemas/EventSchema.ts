import { objectAsync, string, maxLength, toTrimmed, boolean, minLength} from "valibot";
import IsoDateTimeSchema from "~/server/schemas/IsoDateTimeSchema";

export default objectAsync({
  title: string("Value is required", [
    toTrimmed(),
    minLength(1, "Value is required"),
    maxLength(64, "Value is too long"),
  ]),
  allDay: boolean(),
  start: IsoDateTimeSchema,
  end: IsoDateTimeSchema,
})
