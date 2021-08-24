import { BitBurner } from "../types/bitburner";
import { waitFor } from "./shared-wait-for";

const doc = eval("document") as Document;

export async function main(ns: BitBurner) {
  while (true) {
    if (getByText("h1", "Remember all the mines!")) {
      await solveMines(ns);
    } else if (getByText("h1", "Match the symbols!")) {
      await solveMatch(ns);
    } else if (getByText("h1", "Slash")) {
      cheatSlash(ns);
    } else if (
      getByText(
        "h1",
        "Cut the wires with the following properties! (keyboard 1 to 9)"
      )
    ) {
      await solveWires(ns);
    }
    await ns.sleep(50);
  }
}

// this minigame is impossible for me
const cheatSlash = async (ns: BitBurner) => {
  await waitFor(ns, () => getByText("p", "!ATTACKING!"));

  console.log("attacking!");
  const event = new KeyboardEvent("keydown", { keyCode: 32, bubbles: true });

  const eventClone = Object.getOwnPropertyNames(
    Object.getPrototypeOf(event)
  ).reduce((object, key) => {
    // @ts-expect-error yeah no way is this passing the checker
    object[key] = event[key];
    return object;
  }, {}) as any;
  eventClone.isTrusted = true;
  eventClone.preventDefault = () => {};
  // @ts-expect-error ditto
  document.activeElement[
    // @ts-expect-error ditto
    Object.keys(document.activeElement!).find((attr) => {
      return attr.startsWith("__reactEventHandlers");
    })
  ]?.onKeyDown?.(eventClone);
};

const getByText = (tag: keyof HTMLElementTagNameMap, text: string) => {
  return Array.from(doc.querySelectorAll(tag)).find((element) =>
    element.innerText.includes(text)
  );
};

const solveMines = async (ns: BitBurner) => {
  const mines = Array.from(
    doc.querySelectorAll<HTMLSpanElement>("#infiltration-container pre span")
  ).map((element) => {
    return element.innerText.includes("?") ? true : false;
  });

  await waitFor(ns, () => {
    return getByText("h1", "Mark all the mines!");
  });
  doc
    .querySelectorAll<HTMLSpanElement>("#infiltration-container pre span")
    .forEach((element, index) => {
      if (mines[index]) {
        element.style.outline = "3px solid white";
      }
    });
};

const getMatchedItem = (body: HTMLElement) => {
  return Array.from(body.querySelectorAll<HTMLSpanElement>("h2 span"))
    .find((element) => element.style.color === "blue")!
    .innerText.trim();
};

const solveMatch = async (ns: BitBurner) => {
  const body = getByText("h1", "Match the symbols!")!.parentElement!;

  while (getByText("h1", "Match the symbols!")) {
    const currentItem = getMatchedItem(body);

    body.querySelectorAll<HTMLSpanElement>("pre span").forEach((element) => {
      if (element.innerText.trim() === currentItem) {
        element.style.outline = "3px solid white";
      } else {
        element.style.outline = "";
      }
    });

    await waitFor(ns, () => {
      return getMatchedItem(body) !== currentItem;
    });
    await ns.sleep(50);
  }
};

const WIRE_COLORS = {
  yellow: "rgb(255, 193, 7)",
  red: "red",
  blue: "blue",
  white: "white",
};

const solveWires = async (ns: BitBurner) => {
  const conditions = doc.querySelectorAll<HTMLHeadingElement>(
    "#infiltration-container h3"
  );
  const body = getByText(
    "h1",
    "Cut the wires with the following properties! (keyboard 1 to 9)"
  )!.parentElement!;
  const wireCount = body.querySelector("pre")!.childNodes.length;

  const wireIndexes = Array.from(conditions).reduce((set, element) => {
    const text = element.innerText;
    if (text.includes("Cut wires number")) {
      const number = Number(text.match(/[0-9]/)![0]);
      set.add(number - 1);
    } else if (text.includes("wires colored")) {
      const color = text.match(
        /colored ([a-z]+)/
      )![1] as keyof typeof WIRE_COLORS;
      const wires = Array.from(
        body.querySelectorAll<HTMLSpanElement>("pre span")
      ).filter((element) => element.innerText.includes("|"));
      wires.forEach((element, index) => {
        if (element.style.color === WIRE_COLORS[color]) {
          set.add(index % wireCount);
        }
      });
    }
    return set;
  }, new Set<number>());

  Array.from(body.querySelectorAll<HTMLSpanElement>("pre span"))
    .slice(0, wireCount)
    .forEach((element, index) => {
      if (wireIndexes.has(index)) {
        element.style.outline = "3px solid white";
      }
    });

  await waitFor(ns, () => {
    if (
      !getByText(
        "h1",
        "Cut the wires with the following properties! (keyboard 1 to 9)"
      )
    ) {
      return true;
    }
  });
};
