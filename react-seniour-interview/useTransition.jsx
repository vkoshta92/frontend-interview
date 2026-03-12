import { useTransition } from "react";

const [isPending, startTransition] = useTransition();

startTransition(() => {
  // low priority update
});
