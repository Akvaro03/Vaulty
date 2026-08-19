"use client";

import { formatCurrency } from "@/lib/finance-data";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
}

export function AnimatedNumber({ value }: AnimatedNumberProps) {
  const motionValue = useMotionValue(value);

  const springValue = useSpring(motionValue, {
    stiffness: 180,
    damping: 30,
    mass: 0.5,
  });

  const displayValue = useTransform(springValue, (latest) =>
    formatCurrency(latest),
  );

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span>{displayValue}</motion.span>;
}
