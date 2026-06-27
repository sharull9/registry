import { redirect } from "next/navigation"

export default function AuthIndexPage() {
  redirect("/docs/auth/magic-link-form")
}
