import { sha256 } from "js-sha256";
import { WorkoutSplit } from "@/constants/split";

const SECRET = "CHANGE_THIS_SECRET";

function base64Url(json: any) {
  return Buffer.from(JSON.stringify(json))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function shareSplit(split: WorkoutSplit) {

  const header = { alg: "HS256", typ: "JWT" };

  const payload = {
    id: split.split_id,
    name: split.split_name,
    description: split.description,
    creator: split.creator,
    exercises: split.exercises,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };

  const p1 = base64Url(header);
  const p2 = base64Url(payload);

  const signature = sha256.hmac(SECRET, `${p1}.${p2}`);

  return `https://preacherclan.app/split?token=${p1}.${p2}.${signature}`;
}
