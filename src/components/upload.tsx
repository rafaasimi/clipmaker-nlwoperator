import { useCloudinaryWidget } from "../hooks/use-cloudinary";

export function Upload() {
  const { openWidget } = useCloudinaryWidget({
    cloudName: "doo0oabcr",
    uploadPreset: "preset-nlwoperator",
    onSuccess: (result) => {
      console.log("Done! Here is the image info: ", result.info);
    },
  });

  return (
    <button
      id="upload_widget"
      className="cloudinary-button cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      onClick={openWidget}
    >
      Upload files
    </button>
  );
}
