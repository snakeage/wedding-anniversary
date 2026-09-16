export type MapPoint = {
  lat: number;
  lng: number;
};

function fromLngLat(lng: number, lat: number): MapPoint | undefined {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return undefined;
  return { lat, lng };
}

function fromLatLng(lat: number, lng: number): MapPoint | undefined {
  return fromLngLat(lng, lat);
}

function parseCommaPair(value: string): [number, number] | undefined {
  const parts = value.split(",").map((part) => Number(part.trim()));
  if (parts.length < 2) return undefined;
  return [parts[0], parts[1]];
}

export function parseYandexMapPoint(raw: string): MapPoint | undefined {
  const text = raw.trim();
  if (!text) return undefined;

  try {
    const withProto = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    const url = new URL(withProto);
    if (url.hostname.includes("yandex.")) {
      const pt = url.searchParams.get("pt");
      if (pt) {
        const pair = parseCommaPair(pt);
        if (pair) {
          const point = fromLngLat(pair[0], pair[1]);
          if (point) return point;
        }
      }
      const ll = url.searchParams.get("ll");
      if (ll) {
        const pair = parseCommaPair(ll);
        if (pair) {
          const point = fromLngLat(pair[0], pair[1]);
          if (point) return point;
        }
      }
      const rtext = url.searchParams.get("rtext");
      if (rtext) {
        const last = rtext.split("~").filter(Boolean).pop();
        if (last) {
          const pair = parseCommaPair(last);
          if (pair) {
            const point = fromLatLng(pair[0], pair[1]);
            if (point) return point;
          }
        }
      }
    }
  } catch {
    // pasted coordinates, not a URL
  }

  const coords = text.match(/-?\d+\.\d+/g);
  if (coords && coords.length >= 2) {
    return fromLatLng(Number(coords[0]), Number(coords[1]));
  }

  return undefined;
}
