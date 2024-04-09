import { string, toTrimmed, email, minLength, objectAsync } from "valibot";

export default objectAsync({
  email: string("This field is required", [
      toTrimmed(),
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
