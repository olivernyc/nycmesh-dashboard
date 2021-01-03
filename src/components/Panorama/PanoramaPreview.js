import React, { useState, useEffect } from "react";
import { XIcon } from "@primer/octicons-react";

export default function Panos({ panoramas }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (selected == null) return;
    if (!panoramas) return;

    const upHandler = (event) => {
      event.stopPropagation();
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    const downHandler = (event) => {
      event.stopPropagation();
      if (event.key === "ArrowRight") {
        setSelected((s) => (s !== null ? (s + 1) % panoramas.length : null));
      } else if (event.key === "ArrowLeft") {
        setSelected((s) =>
          s !== null ? (s + panoramas.length - 1) % panoramas.length : null
        );
      }
    };

    window.addEventListener("keyup", upHandler, true);
    window.addEventListener("keydown", downHandler, true);
    return () => {
      window.removeEventListener("keyup", upHandler, true);
      window.removeEventListener("keydown", downHandler, true);
    };
  }, [panoramas, selected]);

  if (!panoramas || !panoramas.length)
    return (
      <div className="pv3">
        <span className="light-silver">No panoramas</span>
      </div>
    );
  return (
    <div>
      <div className="overflow-x-scroll pt2">
        <div className="flex">
          {panoramas.map((pano, index) => (
            <img
              key={pano.url}
              src={pano.url}
              alt="rooftop panorama thumbnail"
              className="h3 mr2 bg-near-white pointer"
              style={{ maxWidth: "none" }}
              onClick={() => setSelected(index)}
            />
          ))}
        </div>
      </div>
      {selected !== null ? (
        <div className="fixed absolute--fill z-5 pv4 bg-black">
          <div className="absolute top-0 left-0 right-0 ma3 flex items-center">
            <button
              className="pa0 bn bg-transparent white pointer"
              onClick={() => setSelected(null)}
            >
              <XIcon size="medium" />
            </button>

            <span
              className="w-100 tc mr4 f5 silver"
              style={{ justifySelf: "center" }}
            >
              {selected + 1} of {panoramas.length}
            </span>
          </div>
          <div className="h-100 w-100 flex items-center justify-center">
            <a
              key={panoramas[selected].url}
              href={panoramas[selected].url}
              className="cursor-zoom-in"
            >
              <img
                src={panoramas[selected].url}
                alt="rooftop panorama bg-dark-gray dib"
                style={{
                  maxHeight: "calc(100vh - 8rem)",
                }}
              />
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
