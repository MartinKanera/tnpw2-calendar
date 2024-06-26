import { string, toTrimmed, email, minLength, objectAsync, toLowerCase } from "valibot";

export default objectAsync({
  email: string("This field is required", [
      toTrimmed(),
      toLowerCase(),
      minLength(1, "This field is required."),
      email("Invalid email.")
    ]
  ),
  password: string("This field is required", [
      toTrimmed(),
      minLength(8, "Password must be at least 8 characters long.")
    ]
  )
});
