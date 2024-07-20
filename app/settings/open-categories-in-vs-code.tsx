"use client";
import React from "react";
import { Button } from "@/components/ui/button";

function OpenCategoriesInVSCode() {
  const handleOpenCategoriesInVSCode = async () => {
    fetch("/api/open-in-vs-code", {
      method: "POST",
      body: JSON.stringify("data/settings/categories.json"),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  return (
    <div>
      <Button
        title="فایل فهرست دسته بندی های محلی را در کد VS برای ویرایش باز کنید."
        onClick={handleOpenCategoriesInVSCode}
      >
        لیست دسته ها را در VS Code باز کنید
      </Button>
    </div>
  );
}

export default OpenCategoriesInVSCode;
