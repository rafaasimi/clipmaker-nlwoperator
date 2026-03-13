import { useEffect, useRef } from "react";

export function Upload() {
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!document.getElementById("cloudinary-script")) {
      const script = document.createElement("script");
      script.id = "cloudinary-script";
      script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
      script.async = true;
      script.onload = () => initWidget();
      document.head.appendChild(script);
    } else {
      initWidget();
    }

    function initWidget() {
      // @ts-ignore
      if (window.cloudinary && !widgetRef.current) {
        // @ts-ignore
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
          {
            cloudName: "doo0oabcr",
            uploadPreset: "preset-nlwoperator",
          },
          (error: any, result: { event: string; info: any }) => {
            if (!error && result && result.event === "success") {
              console.log("Done! Here is the image info: ", result.info);
            }
          },
        );
      }
    }
  }, []);

  return (
    <button
      id="upload_widget"
      className="cloudinary-button cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      onClick={() => {
        if (widgetRef.current) {
          widgetRef.current.open();
        }
      }}
    >
      Upload files
    </button>
  );
}
