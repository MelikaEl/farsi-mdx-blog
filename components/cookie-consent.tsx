"use client";
import React from "react";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";

function CookieConsentComponent() {
  return (
    <div>
      {" "}
      <CookieConsent
        location="bottom"
        buttonText="I understand"
        cookieName="mdx_blog_cookie_consent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", background: "#fff", fontSize: "13px" }}
        expires={150} // This is in days. You can adjust as needed.
      >
        "این برنامه وب ممکن است از کوکی‌ها برای بهبود تجربه کاربری استفاده کند{" "}
        <span style={{ fontSize: "10px" }}>
        "ما اطلاعات شخصی شما را با هیچ شخص ثالثی به اشتراک نمی‌گذاریم، نمی‌فروشیم، اجاره نمی‌دهیم یا معامله نمی‌کنیم. برای اطلاعات بیشتر، لطفاً اینجا را ببینید{" "}
          <Link className="font-bold" href="/privacy">
          سیاست حفظ حریم خصوصی
          </Link>
        </span>
      </CookieConsent>
    </div>
  );
}

export default CookieConsentComponent;
