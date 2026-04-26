"use client";

import styles from "./StatusBar.module.css";
import { useEffect, useState } from "react";

export default function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    // Update time every second
    const updateTime = () => setTime(new Date().toLocaleTimeString().toUpperCase());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.statusbar}>
      <div className={styles.left}>
        STATUS: <span className={styles.statusOk}>CONNECTED</span>
      </div>
      <div className={styles.right}>
        {time}
      </div>
    </div>
  );
}
