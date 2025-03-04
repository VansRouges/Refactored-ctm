"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/logo";
import ThemeToggle from "@/components/toggleTheme";
import { LoginAdsSlider } from "@/components/login-ads";
import { SignIn } from "@clerk/nextjs";

function Login() {

  return (
    <div className="flex justify-center relative">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      <Link href={"/"} className="absolute top-8 left-8 text-sm">
        Return
      </Link>
      <div className="flex flex-col justify-center items-center md:items-end w-full md:w-1/2 h-screen">
        <div className="grid gap-4 justify-items-center">
          <motion.div
            initial={{ opacity: 0, translateX: -50 }}
            exit={{ opacity: 1, translateX: 0 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Logo />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 0.3 }}
          >
           <SignIn />
          </motion.div>
        </div>
      </div>
      <div className="w-1/2 hidden md:flex justify-start items-center">
        <div className="w-full grid justify-items-start">
          <LoginAdsSlider />
        </div>
      </div>
    </div>
  );
}


export default Login