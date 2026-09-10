import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Form from "./form";
import Logout from "./logout";

export default async function App() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-4 p-8">
      <Logout />
      <Form />
    </div>
  );
}