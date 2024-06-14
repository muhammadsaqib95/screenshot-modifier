import React, { ReactElement, useCallback } from "react";
import Screenshots from "./Screenshots";
import { Bounds } from "./Screenshots/types";
import "./app.less";
import html2canvas from "html2canvas";
// import imageUrl from './image.jpg'

export default function App(): ReactElement {
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const onSave = useCallback((blob: Blob | null, bounds: Bounds) => {
    console.log("save", blob, bounds);
    if (blob) {
      const url = URL.createObjectURL(blob);
      console.log(url);
      const a = document.createElement("a");
      a.href = url;
      a.download = "screenshot.png";
      a.click();
    }
  }, []);
  const onCancel = useCallback(() => {
    console.log("cancel");
  }, []);
  const onOk = useCallback((blob: Blob | null, bounds: Bounds) => {
    console.log("ok", blob, bounds);
    if (blob) {
      const url = URL.createObjectURL(blob);
      console.log(url);
      window.open(url);
    }
  }, []);

  return (
    <>
      <button
        onClick={async () => {
          try {
            const canvas = await html2canvas(document.body);
            const imageUrl = canvas.toDataURL("image/png");

            // Set the image URL in your state
            setImageUrl(imageUrl);
          } catch (err) {
            console.error("Error capturing screen:", err);
          }
        }}
      >
        Take a screenshot
      </button>
      {imageUrl && (
        <div className="body">
          <Screenshots
            url={imageUrl}
            width={window.innerWidth}
            height={window.innerHeight}
            lang={{
              operation_rectangle_title: "Rectangle",
            }}
            onSave={onSave}
            onCancel={onCancel}
            onOk={onOk}
          />
        </div>
      )}
    </>
  );
}
