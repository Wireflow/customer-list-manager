import { redirect } from "next/navigation";

export default function ListNotFound() {
  redirect("/not-found");
}
