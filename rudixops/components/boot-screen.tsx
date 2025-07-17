
'use client';

import { useEffect, useState } from 'react';

const asciiArt = `██████╗ ██╗   ██╗██████╗ ██╗██╗  ██╗ ██████╗ ██████╗ ███████╗
██╔══██╗██║   ██║██╔══██╗██║╚██╗██╔╝██╔═══██╗██╔══██╗██╔════╝
██████╔╝██║   ██║██║  ██║██║ ╚███╔╝ ██║   ██║██████╔╝███████╗
██╔══██╗██║   ██║██║  ██║██║ ██╔██╗ ██║   ██║██╔═══╝ ╚════██║
██║  ██║╚██████╔╝██████╔╝██║██╔╝ ██╗╚██████╔╝██║     ███████║
╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝
`;

interface DisplayedMessage {
  status: 'OK' | 'FAIL';
  message: string;
}

const bootMessages = [
  "Initializing system components...",
  "Loading kernel modules...",
  "Mounting filesystems...",
  "[NETWORK] Resolving DNS for primary services...",
  "[NETWORK] Establishing secure connection to backend (TLSv1.3)...",
  "Verifying cryptographic checksums...",
  "Checking for cosmic ray interference...", // This will be our funny FAIL message
  "Starting core IDE services...",
  "Checking disk integrity and file system health...",
  "Preparing graphical environment and UI assets...",
  "Compiling essential runtime modules...",
  "Loading user preferences and configurations...",
  "Synchronizing with cloud services...",
  "Launching user interface...",
  "System ready.",
];

const spinnerChars = ['|', '/', '-', '\\'];

export default function BootScreen() {
  const [displayedMessages, setDisplayedMessages] = useState<DisplayedMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [spinnerIndex, setSpinnerIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < bootMessages.length) {
      const timer = setTimeout(() => {
        const messageContent = bootMessages[currentIndex];
        let status: 'OK' | 'FAIL' = 'OK';
        if (messageContent.includes("cosmic ray interference")) {
          status = 'FAIL';
        }
        setDisplayedMessages((prev) => [
          ...prev,
          { status, message: messageContent },
        ]);
        setCurrentIndex((prev) => prev + 1);
      }, 150); // Slower: 150ms per message
      return () => clearTimeout(timer);
    } else {
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 1000); // Wait 1 second after last message before fading

      return () => {
        clearTimeout(fadeTimer);
      };
    }
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpinnerIndex((prev) => (prev + 1) % spinnerChars.length);
    }, 100); // Update spinner every 100ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-start justify-start h-screen w-screen bg-black text-gray-300 font-mono p-8 overflow-hidden transition-opacity duration-1000 ease-out
        ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <pre className="text-gray-300 text-lg mb-4 leading-none">{asciiArt}</pre>
      <pre className="text-sm leading-tight">
        {displayedMessages.map((item, index) => {
          const statusColor = item.status === 'OK' ? 'text-green-400' : 'text-red-500';
          const statusText = item.status === 'OK' ? '  OK  ' : ' FAIL '; // Pad to 6 chars
          return (
            <div key={index}>
              <span className="text-gray-500">[</span>
              <span className={statusColor}>{statusText}</span>
              <span className="text-gray-500">]</span> {item.message}
            </div>
          );
        })}
      </pre>
      {!fadeOut && (
        <div className="mt-4 text-green-400">
          {spinnerChars[spinnerIndex]}
        </div>
      )}
    </div>
  );
}
