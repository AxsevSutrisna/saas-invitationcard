"use client";

import { useEffect, useState } from "react";

export function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    const targetTime = new Date(targetDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isCompleted) {
    return (
      <div className="py-4 text-center">
        <span className="font-heading text-lg font-bold text-[#C8A96A] animate-pulse">
          ✨ Hari Bahagia Telah Tiba! ✨
        </span>
      </div>
    );
  }

  const items = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto text-center pt-2">
      {items.map((item, idx) => (
        <div key={idx} className="p-2 sm:p-3 rounded-2xl bg-white/60 dark:bg-zinc-800/60 border border-[#C8A96A]/20 shadow-sm space-y-0.5">
          <p className="font-heading text-xl sm:text-2xl font-black text-[#C8A96A] tracking-tight">
            {String(item.value).padStart(2, "0")}
          </p>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
