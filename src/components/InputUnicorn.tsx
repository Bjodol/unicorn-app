import axios from "axios";
import React, { useEffect, useMemo } from "react";
import { Unicorn as UnicornType } from "../models";
import { Unicorn } from "./Unicorn";

export const InputUnicorn: React.FC<{
  initialState?: UnicornType;
  disabled?: boolean;
  id?: string;
}> = ({ initialState, disabled, id }) => {
  const [fillElements, setFillElements] = React.useState<NodeList>();
  const [colorState, setColorState] = React.useState<{
    [pathId: string]: string;
  }>(
    initialState?.colors.reduce(
      (acc, cur) => ({ ...acc, [cur.pathId]: cur.color }),
      {}
    ) ?? {}
  );
  const [formState, setFormState] = React.useState<
    Pick<UnicornType, "equipment" | "nickname" | "phoneNo">
  >({
    equipment: "",
    nickname: "",
    phoneNo: "",
  });
  useEffect(() => {
    const correctElement = document.getElementById(id);
    const fillableElements = correctElement.querySelectorAll(`[fill="#eee"]`);
    setFillElements(fillableElements);
  }, [id]);

  useEffect(() => {
    Object.entries(colorState).forEach(([pathId, color]) => {
      const correctElement = document.getElementById(id);
      const el = correctElement.querySelector(`#${pathId}`);
      el.setAttribute("fill", color);
    });
  }, [colorState, id]);

  useEffect(() => {
    Array.from(fillElements ?? []).forEach((node) => {
      const listener = () => {
        const inputEl = document.getElementById(`input-${(node as any).id}`);
        if (!disabled) inputEl?.click();
      };
      node.addEventListener("click", listener);
    });
    return () => {
      Array.from(fillElements ?? []).forEach((node) => {
        const listener = () => {
          const inputEl = document.getElementById(`input-${(node as any).id}`);
          inputEl?.click();
        };
        node.removeEventListener("click", listener);
      });
    };
  }, [fillElements, disabled]);

  const ids = useMemo(() => {
    return Array.from(fillElements ?? []).map((node) => (node as any).id);
  }, [fillElements]);

  const onSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async (e) => {
    e.preventDefault();
    const payload: UnicornType = {
      ...formState,
      colors: Object.entries(colorState).map(([pathId, color]) => ({
        color,
        pathId,
      })),
    };
    await axios.post(
      "https://unicorn-api.vercel.app/api/unicorns",
      payload
    );
  };

  return (
    <form className="w-full space-y-4" onSubmit={onSubmit}>
      <Unicorn height="100%" width="100%" id={id} />
      {disabled && <h3 className="text-center">{initialState.nickname}</h3>}
      {!disabled && (
        <>
          <label>
            <span>Nickname</span>
            <input
              disabled={disabled}
              name="nickname"
              type="text"
              className="border rounded border-gray-300 w-full p-4"
              onChange={({ target: { value, name } }) => {
                setFormState({ ...formState, [name]: value });
              }}
            />
          </label>
          {ids.map((id) => (
            <div key={id}>
              <label className="grid grid-cols-2 text-right gap-4 items-center sr-only">
                <span>Color {id}</span>
                <input
                  disabled={disabled}
                  tabIndex={-1}
                  id={`input-${id}`}
                  className="w-full h-12"
                  type="color"
                  value={colorState[id] ?? "#eeeeee"}
                  onChange={({ target: { value } }) => {
                    setColorState({ ...colorState, [id]: value });
                  }}
                />
              </label>
            </div>
          ))}
          <button
            type="submit"
            className="p-4 bg-purple-600 rounded text-white w-full font-bold"
          >
            Save
          </button>
        </>
      )}
    </form>
  );
};
