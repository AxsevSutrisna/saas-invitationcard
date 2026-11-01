import { useCallback, useRef, useState } from "react";

/**
 * useFeedback — state notifikasi seragam untuk form/aksi client.
 * Menggantikan trio `const [feedback,setFeedback]` + helper `notify()` yang
 * di-copy di beberapa komponen. Sukses auto-hilang setelah `successTimeout` ms.
 *
 * @param {{ successTimeout?: number }} [opts]
 * @returns {{ feedback: {type:string,message:string}, notify: (type:string,msg:string)=>void, clear: ()=>void }}
 */
export function useFeedback({ successTimeout = 4000 } = {}) {
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const timer = useRef(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setFeedback({ type: "", message: "" });
  }, []);

  const notify = useCallback(
    (type, message) => {
      if (timer.current) clearTimeout(timer.current);
      setFeedback({ type, message });
      if (type === "success" && successTimeout) {
        timer.current = setTimeout(() => setFeedback({ type: "", message: "" }), successTimeout);
      }
    },
    [successTimeout]
  );

  return { feedback, notify, clear };
}
