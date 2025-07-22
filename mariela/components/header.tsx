"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Header() {
  const [isHidden, setHidden] = useState(true);
  const [contactSectionTop, setContactSectionTop] = useState(Infinity);
  const { scrollY } = useScroll();

  useEffect(() => {
    const contactElement = document.getElementById("contact");
    if (contactElement) {
      setContactSectionTop(contactElement.offsetTop);
    }
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isAfterHero = latest > window.innerHeight;
    const isBeforeContact = latest < contactSectionTop - window.innerHeight;

    if (isAfterHero && isBeforeContact) {
      setHidden(false);
    } else {
      setHidden(true);
    }
  });

  const scrollToBottom = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.href.split("#")[1];
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full px-8 py-4 z-50 text-white"
    >
      <div className="flex items-start justify-between max-w-7xl mx-auto">
        <a href="tel:0898800456" className="text-lg font-medium pt-2">
          089 8800456
        </a>
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="w-32 md:w-40" />
        </Link>
        <a
          href="#contact"
          onClick={scrollToBottom}
          className="text-lg font-medium pt-2"
        >
          Контакти
        </a>
      </div>
    </motion.header>
  );
}