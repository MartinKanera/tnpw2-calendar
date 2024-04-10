import { string, toTrimmed, email, minLength, objectAsync, maxLength, toLowerCase } from "valibot";

export default objectAsync({
  username: string("This field is required", [
      toTrimmed(),
      minLength(3, "Username must be at least 3 characters long."),
      maxLength(16, "Username must be at most 16 characters long.")
    ]
  ),
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
